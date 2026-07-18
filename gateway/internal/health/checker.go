package health

import (
	"context"
	"gateway/internal/config"
	"gateway/pkg/pb"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

const checkTimeout = 3 * time.Second

// CheckDependencies logs the health of every gRPC service the gateway uses.
// A failed check is intentionally non-fatal: the gateway can start and expose
// its own health endpoint while a dependency is recovering.
func CheckDependencies(cfg *config.Config) {
	checkUserService(cfg.UserServiceUrl)
	checkResourceService(cfg.ResourceServiceUrl)
	checkAiService(cfg.AiServiceUrl)
}

func dial(address string) (*grpc.ClientConn, context.Context, context.CancelFunc, error) {
	ctx, cancel := context.WithTimeout(context.Background(), checkTimeout)
	conn, err := grpc.DialContext(
		ctx,
		address,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	if err != nil {
		cancel()
		return nil, nil, nil, err
	}
	return conn, ctx, cancel, nil
}

func checkUserService(address string) {
	conn, ctx, cancel, err := dial(address)
	if err != nil {
		log.Printf("Dependency unhealthy: user-service (%s): %v", address, err)
		return
	}
	defer conn.Close()
	defer cancel()

	response, err := pb.NewUserServiceClient(conn).HealthCheck(ctx, &pb.HealthCheckRequest{})
	if err != nil {
		log.Printf("Dependency unhealthy: user-service (%s): %v", address, err)
		return
	}
	if !response.GetHealthy() {
		log.Printf("Dependency unhealthy: user-service (%s): reported unhealthy", address)
		return
	}

	log.Printf("Dependency healthy: user-service (%s)", address)
}

func checkResourceService(address string) {
	conn, _, cancel, err := dial(address)
	if err != nil {
		log.Printf("Dependency unhealthy: resource-service (%s): %v", address, err)
		return
	}
	defer conn.Close()
	defer cancel()

	// ResourceProgressService does not currently define a health RPC. A blocking
	// gRPC dial verifies that its configured endpoint is accepting connections.
	log.Printf("Dependency healthy: resource-service (%s)", address)
}

func checkAiService(address string) {
	conn, _, cancel, err := dial(address)
	if err != nil {
		log.Printf("Dependency unhealthy: ai-service (%s): %v", address, err)
		return
	}
	defer conn.Close()
	defer cancel()

	// AiService does not currently define a health RPC. A blocking gRPC dial
	// verifies that its configured endpoint is accepting connections.
	log.Printf("Dependency healthy: ai-service (%s)", address)
}
