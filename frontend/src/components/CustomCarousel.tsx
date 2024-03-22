import { useQuery } from "@tanstack/react-query";
import PocketBase from "pocketbase";
import { Spinner, Alert, Container, Carousel } from "react-bootstrap";

const pb = new PocketBase("http://127.0.0.1:80");

interface CustomCarouselProps {
    filterDate?: boolean;
    forceCaption?: boolean;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({filterDate = true, forceCaption = false}) => {
    const { data, isLoading, error } = useQuery({
        queryFn: async () => {
            const records = await pb.collection("Post").getFullList({
                sort: "-created",
            });
            return filterDate ? records.filter(
                (post) => new Date(post.expiringDate) > new Date()
            ) : records;
        },
        queryKey: ["records"],
        refetchInterval: 60000,
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

    return (
        <Carousel controls={false}>
            {data?.map((post) => (
                <Carousel.Item key={post.id} interval={5000}>
                    <div
                        style={{
                            height: "100vh",
                            width: "100vw",
                            backgroundColor: "black"
                        }}
                    >
                        <img
                            className="d-block w-100"
                            src={pb.getFileUrl(post, post.image)}
                            style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain"
                            }}
                            alt={post.title}
                        />
                    </div>
                    {(post.detailView || forceCaption) && (
                        <Carousel.Caption>
                            <h4 className="display">{post.title}</h4>
                        </Carousel.Caption>
                    )}
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default CustomCarousel;
