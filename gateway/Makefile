# gateway/Makefile

.PHONY: generate

# Add Go binaries to PATH for current shell
export PATH := $(shell go env GOPATH)/bin:$(PATH)

# Path to the buf binary in the user-service node_modules
BUF := ../services/user-service/node_modules/.bin/buf

generate:
	@echo "Generating Go protobuf and gRPC from shared proto..."
	@$(BUF) generate ../shared/proto
	@echo "Generating TypeScript types in user-service..."
	@cd ../services/user-service && PATH="$$PWD/node_modules/.bin:$$PATH" ./node_modules/.bin/buf generate /Users/rishikchowdarykaruturi/codit/shared/proto
	@echo "Generation complete! Check gateway/pkg/pb and services/user-service/src/generated for output."
