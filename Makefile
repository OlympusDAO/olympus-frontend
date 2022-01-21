# Populate variables
-include .env # Ignore the error if .env is missing
export

### Git variables
CURRENT_BRANCH=$(shell git branch --show-current)
# "/" is a common character in git branches, but we can't use it in the docker image tag
CURRENT_BRANCH_CLEAN=$(subst /,-,$(CURRENT_BRANCH))

### frontend variables
FRONTEND_IMAGE=ghcr.io/olympusdao/olympus-frontend
FRONTEND_TAG=$(CURRENT_BRANCH_CLEAN)
FRONTEND_ENV_ARGS=
FRONTEND_VOLUME_ARGS=--volume $(shell pwd):/usr/src/app
FRONTEND_PORT_ARGS=--network=host

### e2e test variables
TEST_IMAGE=olympus-frontend-tests
# Use the branch name as the tag
TEST_TAG=$(CURRENT_BRANCH_CLEAN)
TEST_ENV_ARGS=-e REACT_APP_XVFB_ENABLED=true -e REACT_APP_PRIVATE_KEY=$(REACT_APP_PRIVATE_KEY)
TEST_VOLUME_ARGS=--volume $(shell pwd):/usr/src/app
TEST_PORT_ARGS=--network=host

#### e2e stack variables
STACK_ENV_ARGS=-e FRONTEND_DOCKER_TAG=$(FRONTEND_TAG)
STACK_FILE_ARGS=-f tests/docker-compose.yml
STACK_UP_ARGS=--abort-on-container-exit --build
CONTRACTS_DOCKER_TAG?=main # Sets to main by default

### frontend
build_docker:
	@echo "*** Building Docker image $(FRONTEND_IMAGE) with tag $(FRONTEND_TAG)"
	docker pull $(FRONTEND_IMAGE):$(FRONTEND_TAG)
	docker build -t $(FRONTEND_IMAGE):$(FRONTEND_TAG) -f Dockerfile .

run_docker: build_docker
	@echo "*** Running Docker image $(FRONTEND_IMAGE) with tag $(FRONTEND_TAG)"
	@docker run -it --rm $(FRONTEND_ENV_ARGS) $(FRONTEND_VOLUME_ARGS) $(FRONTEND_PORT_ARGS) $(FRONTEND_IMAGE):$(FRONTEND_TAG)

### end-to-end testing
test_e2e_build_docker:
	@echo "*** Building Docker image $(TEST_IMAGE) with tag $(TEST_TAG)"
	docker build -t $(TEST_IMAGE):$(TEST_TAG) -f tests/Dockerfile .

test_e2e_run_docker: test_e2e_build_docker
	@echo "*** Running Docker image $(TEST_IMAGE) with tag $(TEST_TAG)"
	@docker run -it --rm $(TEST_ENV_ARGS) $(TEST_VOLUME_ARGS) $(TEST_PORT_ARGS) $(TEST_IMAGE):$(TEST_TAG)

test_e2e_run:
	yarn run react-scripts test --testPathPattern="(\\.|/|-)e2e\\.(test|spec)\\.[jt]sx?" --testTimeout=30000 --runInBand --watchAll=false --detectOpenHandles --forceExit

### end-to-end docker stack
test_e2e_stack_start: test_e2e_stack_stop
	@echo "*** Setting up e2e stack in Docker"
	@echo "Image tag for olympus-contracts is: ${CONTRACTS_DOCKER_TAG}"
	@CONTRACTS_DOCKER_TAG=${CONTRACTS_DOCKER_TAG} docker-compose $(STACK_FILE_ARGS) $(STACK_ENV_ARGS) pull
	@echo "*** Starting e2e stack in Docker"
	@CONTRACTS_DOCKER_TAG=${CONTRACTS_DOCKER_TAG} docker-compose $(STACK_FILE_ARGS) $(STACK_ENV_ARGS) up $(STACK_UP_ARGS)

test_e2e_stack_stop:
	@echo "*** Stopping e2e stack in Docker"
	@docker-compose $(STACK_FILE_ARGS) rm --stop --force
