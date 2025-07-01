FROM python:3.11-slim AS builder
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --user -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY backend src/backend
EXPOSE 5000
CMD ["python", "-m", "src.backend.app"]
