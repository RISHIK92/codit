# gateway/Makefile

.PHONY: generate

# Add Go binaries to PATH for current shell
export PATH := $(shell go env GOPATH)/bin:$(PATH)

# Path to the buf binary in the user-service node_modules
BUF := ../services/user-service/node_modules/.bin/buf

generate:
	@echo "Generating Go protobuf and gRPC from shared proto..."
	@$(BUF) generate ../shared/proto
	@echo "Generation complete! Check gateway/pkg/pb for the output."
