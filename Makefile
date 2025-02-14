# Variables
IMAGE_NAME = portfolio-dev
CONTAINER_NAME = portfolio-container
PORT = 3000

# Colores para los mensajes
GREEN = \033[0;32m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: build run stop clean help

# Comando por defecto al ejecutar make sin argumentos
default: help

# Construir la imagen Docker
build:
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker build -t $(IMAGE_NAME) .

# Verificar puerto disponible
check-port:
	@if lsof -Pi :$(PORT) -sTCP:LISTEN -t >/dev/null ; then \
		echo "$(RED)Error: Port $(PORT) is already in use$(NC)"; \
		exit 1; \
	fi

# Ejecutar el contenedor
run: stop check-port
	@echo "$(GREEN)Running container on port $(PORT)...$(NC)"
	docker run -d -p $(PORT):3000 --name $(CONTAINER_NAME) $(IMAGE_NAME)
	@echo "$(GREEN)Application is running at http://localhost:$(PORT)$(NC)"

# Detener y eliminar el contenedor
stop:
	@echo "$(GREEN)Stopping container...$(NC)"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Limpiar todo (contenedor e imagen)
clean: stop
	@echo "$(GREEN)Removing image...$(NC)"
	docker rmi $(IMAGE_NAME) || true

# Reiniciar el contenedor (detener, eliminar y volver a ejecutar)
restart: stop run
	@echo "$(GREEN)Container restarted$(NC)"

# Mostrar los logs del contenedor
logs:
	@echo "$(GREEN)Showing container logs...$(NC)"
	docker logs -f $(CONTAINER_NAME)

# Mostrar ayuda
help:
	@echo "$(GREEN)Available commands:$(NC)"
	@echo "  make build    - Build Docker image"
	@echo "  make run      - Run container"
	@echo "  make stop     - Stop and remove container"
	@echo "  make clean    - Remove container and image"
	@echo "  make restart  - Restart container"
	@echo "  make logs     - Show container logs" 