#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import json
import re
from typing import Dict, Any, List, Optional

def clean_currency_value(value: str) -> float:
    """Limpa valores monetários brasileiros e converte para float"""
    if pd.isna(value) or value == '' or not isinstance(value, str):
        return 0.0
    
    # Remove R$, espaços, e converte vírgula para ponto
    cleaned = re.sub(r'R\$\s*', '', str(value))
    cleaned = cleaned.replace('.', '').replace(',', '.')
    
    try:
        return float(cleaned)
    except (ValueError, TypeError):
        return 0.0

def clean_percentage_value(value: str) -> float:
    """Limpa valores percentuais e converte para float"""
    if pd.isna(value) or value == '' or not isinstance(value, str):
        return 0.0
    
    # Remove % e converte
    cleaned = str(value).replace('%', '').replace(',', '.')
    
    try:
        return float(cleaned)
    except (ValueError, TypeError):
        return 0.0

def extract_category_from_description(description: str) -> str:
    """Extrai categoria baseada na descrição do produto"""
    if pd.isna(description) or description == '':
        return 'Geral'
    
    desc_lower = description.lower()
    
    # Mapeamento de palavras-chave para categorias
    category_keywords = {
        'Comedouros e Bebedouros': ['comedouro', 'bebedouro', 'af', 'anti-formiga'],
        'Brinquedos': ['ratinho', 'varinha', 'bola', 'brinquedo', 'rato'],
        'Higiene': ['escova', 'tira pelo', 'luva', 'vapor', 'pente', 'pulga'],
        'Acessórios para Gato': ['bandeja', 'pá', 'gato', 'kit', 'graminha', 'trilho'],
        'Acessórios para Cão': ['xixi dog', 'sanitário', 'cão'],
        'Transporte': ['caixa', 'transporte', 'mma'],
        'Diversos': ['mamadeira', 'refil', 'cata caca', 'caneta', 'gravadora']
    }
    
    for category, keywords in category_keywords.items():
        if any(keyword in desc_lower for keyword in keywords):
            return category
    
    return 'Geral'

def determine_brand(description: str, ncm: str) -> str:
    """Determina a marca baseada na descrição e NCM"""
    if pd.isna(description):
        return 'Pet Shop'
    
    # Algumas marcas conhecidas que podem aparecer
    known_brands = ['ferplast', 'mma']
    desc_lower = description.lower()
    
    for brand in known_brands:
        if brand in desc_lower:
            return brand.title()
    
    return 'Pet Shop'

def estimate_stock(cost: float, margin: float) -> int:
    """Estima estoque baseado no custo e margem"""
    if cost <= 2.0:
        return 25  # Produtos baratos, mais estoque
    elif cost <= 10.0:
        return 15  # Produtos médios
    elif cost <= 30.0:
        return 8   # Produtos caros
    else:
        return 3   # Produtos muito caros
    
def generate_slug(name: str) -> str:
    """Gera um slug para URL amigável"""
    if pd.isna(name):
        return 'produto'
    
    slug = name.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)  # Remove caracteres especiais
    slug = re.sub(r'[-\s]+', '-', slug)   # Substitui espaços por hífens
    slug = slug.strip('-')                # Remove hífens das extremidades
    
    return slug or 'produto'

def process_csv_to_products(csv_file_path: str) -> List[Dict[str, Any]]:
    """Processa o arquivo CSV e retorna lista de produtos formatados"""
    
    print(f"Lendo arquivo CSV: {csv_file_path}")
    
    # Lê o CSV
    df = pd.read_csv(csv_file_path, encoding='utf-8')
    
    print(f"Colunas encontradas: {list(df.columns)}")
    print(f"Total de linhas: {len(df)}")
    
    products = []
    product_id = 1
    
    for index, row in df.iterrows():
        # Pula linhas que são cabeçalhos de categoria ou vazias
        if (pd.isna(row['id']) or 
            str(row['id']).strip() == '' or 
            pd.isna(row['description']) or 
            str(row['description']).strip() == '' or
            str(row['description']).strip().isupper()):  # Cabeçalhos são em maiúscula
            continue
        
        # Extrai e limpa os dados
        name = str(row['description']).strip()
        if not name or name == 'nan':
            continue
            
        # Limpa quebras de linha do nome
        name = re.sub(r'\s+', ' ', name.replace('\n', ' '))
        
        unit_price = clean_currency_value(row['unit_price'])
        promo_price = clean_currency_value(row['promo_price'])
        cost = clean_currency_value(row['cost'])
        margin = clean_percentage_value(row['margin'])
        
        # Usa o menor preço entre unit_price e promo_price (se houver)
        final_price = unit_price
        if promo_price > 0 and promo_price < unit_price:
            final_price = promo_price
        
        # Pula produtos sem preço válido
        if final_price <= 0:
            continue
        
        # Gera os campos derivados
        category = extract_category_from_description(name)
        brand = determine_brand(name, str(row.get('NCM', '')))
        stock = estimate_stock(cost, margin)
        slug = generate_slug(name)
        
        # Cria o produto
        product = {
            'id': product_id,
            'name': name,
            'slug': slug,
            'price': round(final_price, 2),
            'originalPrice': round(unit_price, 2) if promo_price > 0 and promo_price < unit_price else None,
            'cost': round(cost, 2),
            'margin': round(margin, 2),
            'image': f'/images/products/{slug}.jpg',
            'images': [
                f'/images/products/{slug}.jpg',
                f'/images/products/{slug}-2.jpg'
            ],
            'description': f'{name}. Produto de alta qualidade para seu pet.',
            'shortDescription': name,
            'category': category,
            'brand': brand,
            'stock': stock,
            'inStock': stock > 0,
            'featured': margin > 150,  # Produtos com alta margem são destaque
            'active': str(row.get('cadastro', '')).lower() == 'ok',
            'weight': 0.5,  # Peso padrão em kg
            'dimensions': {
                'width': 10,
                'height': 5,
                'depth': 10
            },
            'tags': [
                category.lower().replace(' ', '-'),
                brand.lower(),
                'pet',
                'animal'
            ],
            'seo': {
                'title': f'{name} - {brand}',
                'description': f'Compre {name} na nossa loja. {category} de qualidade para seu pet.',
                'keywords': [name.lower(), category.lower(), brand.lower(), 'pet']
            },
            'createdAt': '2025-01-01T00:00:00Z',
            'updatedAt': '2025-01-01T00:00:00Z'
        }
        
        products.append(product)
        product_id += 1
        
        print(f"Produto {product_id-1}: {name} - R$ {final_price}")
    
    print(f"\nTotal de produtos processados: {len(products)}")
    return products

def save_products_json(products: List[Dict[str, Any]], output_file: str):
    """Salva os produtos em formato JSON"""
    
    print(f"Salvando {len(products)} produtos em {output_file}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print("Arquivo JSON salvo com sucesso!")

def generate_summary(products: List[Dict[str, Any]]):
    """Gera um resumo dos produtos processados"""
    
    total_products = len(products)
    categories = {}
    brands = {}
    price_ranges = {'0-10': 0, '10-25': 0, '25-50': 0, '50+': 0}
    
    for product in products:
        # Contagem por categoria
        cat = product['category']
        categories[cat] = categories.get(cat, 0) + 1
        
        # Contagem por marca
        brand = product['brand']
        brands[brand] = brands.get(brand, 0) + 1
        
        # Contagem por faixa de preço
        price = product['price']
        if price < 10:
            price_ranges['0-10'] += 1
        elif price < 25:
            price_ranges['10-25'] += 1
        elif price < 50:
            price_ranges['25-50'] += 1
        else:
            price_ranges['50+'] += 1
    
    print("\n" + "="*50)
    print("RESUMO DOS PRODUTOS PROCESSADOS")
    print("="*50)
    print(f"Total de produtos: {total_products}")
    
    print(f"\nCategorias:")
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count}")
    
    print(f"\nMarcas:")
    for brand, count in sorted(brands.items()):
        print(f"  {brand}: {count}")
    
    print(f"\nFaixas de preço:")
    for range_name, count in price_ranges.items():
        print(f"  R$ {range_name}: {count}")

if __name__ == "__main__":
    # Caminhos dos arquivos
    csv_file = "/home/vinicius/Documentos/dev/marketplace/catalagos-produtos-v-1-2/catalago-fernado-pet/data/TABELA INJETADOS SHOPEE UTL.xlsx - produtos.csv"
    json_file = "/home/vinicius/Documentos/dev/marketplace/catalagos-produtos-v-1-2/catalago-fernado-pet/public/data/produtos.json"
    
    try:
        # Processa o CSV
        products = process_csv_to_products(csv_file)
        
        if not products:
            print("Nenhum produto foi processado. Verifique o arquivo CSV.")
            exit(1)
        
        # Salva o JSON
        save_products_json(products, json_file)
        
        # Gera resumo
        generate_summary(products)
        
        print(f"\n✅ Processamento concluído com sucesso!")
        print(f"📁 Arquivo gerado: {json_file}")
        
    except Exception as e:
        print(f"❌ Erro durante o processamento: {str(e)}")
        import traceback
        traceback.print_exc()
