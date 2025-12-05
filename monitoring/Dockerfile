FROM alpine:latest

# Install dependencies from Alpine repositories
RUN apk add --no-cache \
    prometheus

# Configure Prometheus
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Expose Prometheus port
EXPOSE 9090

# Run Prometheus directly
CMD ["prometheus", "--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.path=/prometheus"]
