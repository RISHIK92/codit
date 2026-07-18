package proxy

import (
	"context"

	"github.com/go-chi/chi/v5/middleware"
	"google.golang.org/grpc/metadata"
)

// withRequestID forwards the chi request ID (set by middleware.RequestID in
// router.go) to a downstream gRPC service as metadata, so that service's own
// logs can be correlated back to this HTTP request.
func withRequestID(ctx context.Context) context.Context {
	id := middleware.GetReqID(ctx)
	if id == "" {
		return ctx
	}
	return metadata.AppendToOutgoingContext(ctx, "x-request-id", id)
}
