# Variables
IMAGE_NAME = portfolio-dev
CONTAINER_NAME = portfolio-container
PORT = 3000
DOCKER_BUILD_FLAGS = --no-cache --pull

# Colores para los mensajes
GREEN = \033[0;32m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: build run stop clean help dev build-local preview check-port logs restart

# Comando por defecto al ejecutar make sin argumentos
default: help

# Construir la imagen Docker
build:
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker build $(DOCKER_BUILD_FLAGS) -t $(IMAGE_NAME) .

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
	-docker stop $(CONTAINER_NAME) 2>/dev/null || true
	-docker rm $(CONTAINER_NAME) 2>/dev/null || true

# Limpiar todo (contenedor e imagen)
clean: stop
	@echo "$(GREEN)Removing image...$(NC)"
	-docker rmi $(IMAGE_NAME) 2>/dev/null || true

# Reiniciar el contenedor (detener, eliminar y volver a ejecutar)
restart: stop run
	@echo "$(GREEN)Container restarted$(NC)"

# Mostrar los logs del contenedor
logs:
	@echo "$(GREEN)Showing container logs...$(NC)"
	docker logs -f $(CONTAINER_NAME)

# Desarrollo local
dev:
	@echo "$(GREEN)Starting development server...$(NC)"
	npm run dev

# Build local
build-local:
	@echo "$(GREEN)Building project locally...$(NC)"
	npm run build

# Preview local
preview:
	@echo "$(GREEN)Starting preview server...$(NC)"
	npm run preview

# Mostrar ayuda
help:
	@echo "$(GREEN)Available commands:$(NC)"
	@echo "  make build        - Build Docker image (with --no-cache and --pull flags)"
	@echo "  make run         - Run container on port $(PORT)"
	@echo "  make stop        - Stop and remove container"
	@echo "  make clean       - Remove container and image"
	@echo "  make restart     - Restart container"
	@echo "  make logs        - Show container logs"
	@echo "  make dev         - Start development server"
	@echo "  make build-local - Build project locally"
	@echo "  make preview     - Preview built project locally" 