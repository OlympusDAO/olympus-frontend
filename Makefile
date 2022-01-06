# Populate variables
include .env
export

### Git variables
CURRENT_BRANCH=$(shell git branch --show-current)
# "/" is a common character in git branches, but we can't use it in the docker image tag
CURRENT_BRANCH_CLEAN=$(subst /,-,$(CURRENT_BRANCH))

### e2e test variables
TEST_IMAGE=olympus-frontend-tests
# Use the branch name as the tag
TEST_TAG=$(CURRENT_BRANCH_CLEAN)
TEST_ENV_ARGS=
TEST_VOLUME_ARGS=--volume $(shell pwd)/tests:/usr/src/app/tests/
TEST_PORT_ARGS=

build_e2e:
	@echo "*** Building Docker image $(TEST_IMAGE) with tag $(TEST_TAG)"
	docker build -t $(TEST_IMAGE):$(TEST_TAG) -f tests/Dockerfile .

run_e2e: build_e2e
	@echo "*** Running Docker image $(TEST_IMAGE) with tag $(TEST_TAG)"
	@docker run -it --rm $(TEST_ENV_ARGS) $(TEST_VOLUME_ARGS) $(TEST_PORT_ARGS) $(TEST_IMAGE):$(TEST_TAG)
