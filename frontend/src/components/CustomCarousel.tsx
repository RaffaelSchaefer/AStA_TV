import { useQuery } from "@tanstack/react-query";
import PocketBase from "pocketbase";
import { Spinner, Alert, Container, Carousel } from "react-bootstrap";

const pb = new PocketBase("http://127.0.0.1:8090");

function CustomCarousel() {
    const { data, isLoading, error } = useQuery({
        queryFn: async () => {
            const records = await pb.collection("Post").getFullList({
                sort: "-created",
            });
            return records;
        },
        queryKey: ["records"],
        refetchInterval: 10000
    });

    if (isLoading)
        return (
            <div className="d-flex justify-content-center mt-3">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );

    if (error)
        return (
            <Container className="mt-3">
                <Alert variant="danger">{String(error)}</Alert>
            </Container>
        );

    //TODO Fix the image source
    return (
        <Carousel controls={false}>
            {data?.map((post) => (
                <Carousel.Item key={post.id} interval={1000}>
                    <img
                        className="d-block w-100"
                        src={`http://127.0.0.1:8090/api/files/${post.collectionId}/${post.id}/${post.image}`}
                        style={{ height: "100vh", width: "100vw" }}
                        alt={post.title}
                    />
                    {post.detailView && (
                        <Carousel.Caption>
                            <h4 className="display">{post.title}</h4>
                            <p>{post.description}</p>
                        </Carousel.Caption>
                    )}
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default CustomCarousel;
