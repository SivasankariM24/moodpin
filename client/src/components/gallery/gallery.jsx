import GalleryItem from "../galleryItem/galleryItem";
import "./gallery.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import Skeleton from "../skeleton/skeleton";

// const items = [
//   {
//     id: 1,
//     media: "/pins/pin1.jpeg",
//     width: 1260,
//     height: 1000,
//   },
//   {
//     id: 2,
//     media: "/pins/pin2.jpeg",
//     width: 1260,
//     height: 1400,
//   },
//   {
//     id: 3,
//     media: "/pins/pin3.jpeg",
//     width: 1260,
//     height: 1400,
//   },
//   {
//     id: 4,
//     media: "/pins/pin4.jpeg",
//     width: 1260,
//     height: 1000,
//   },
//   {
//     id: 5,
//     media: "/pins/pin5.jpeg",
//     width: 1260,
//     height: 1243,
//   },
//   {
//     id: 6,
//     media: "/pins/pin6.jpeg",
//     width: 1260,
//     height: 1568,
//   },
//   {
//     id: 7,
//     media: "/pins/pin7.jpeg",
//     width: 1260,
//     height: 1234,
//   },
//   {
//     id: 8,
//     media: "/pins/pin8.jpeg",
//     width: 1260,
//     height: 1400,
//   },
//   {
//     id: 9,
//     media: "/pins/pin9.jpeg",
//     width: 1260,
//     height: 1000,
//   },
//   {
//     id: 10,
//     media: "/pins/pin10.jpeg",
//     width: 1260,
//     height: 1000,
//   },
//   {
//     id: 11,
//     media: "/pins/pin11.jpeg",
//     width: 1260,
//     height: 1000,
//   },
//   {
//     id: 12,
//     media: "/pins/pin12.jpeg",
//     width: 1260,
//     height: 1400,
//   },
//   {
//     id: 13,
//     media: "/pins/pin13.jpeg",
//     width: 1260,
//     height: 1400,
//   },
//   {
//     id: 14,
//     media: "/pins/pin14.jpeg",
//     width: 1260,
//     height: 1600,
//   },
//   {
//     id: 15,
//     media: "/pins/pin15.jpeg",
//     width: 1260,
//     height: 1000,
//   },
//   {
//     id: 16,
//     media: "/pins/pin16.jpeg",
//     width: 1260,
//     height: 1260,
//   },
//   {
//     id: 17,
//     media: "/pins/pin17.jpeg",
//     width: 1260,
//     height: 1000,
//   },
//   {
//     id: 18,
//     media: "/pins/pin18.jpeg",
//     width: 1260,
//     height: 1260,
//   },
//   {
//     id: 19,
//     media: "/pins/pin19.jpeg",
//     width: 1260,
//     height: 1400,
//   },
//   {
//     id: 20,
//     media: "/pins/pin20.jpeg",
//     width: 1260,
//     height: 1260,
//   },
//   {
//     id: 21,
//     media: "/pins/pin21.jpeg",
//     width: 1260,
//     height: 1400,
//   },
//   {
//     id: 22,
//     media: "/pins/pin22.jpeg",
//     width: 1260,
//     height: 1890,
//   },
//   {
//     id: 23,
//     media: "/pins/pin23.jpeg",
//     width: 1260,
//     height: 1260,
//   },
//   {
//     id: 24,
//     media: "/pins/pin24.jpeg",
//     width: 1260,
//     height: 1260,
//   },
//   {
//     id: 25,
//     media: "/pins/pin25.jpeg",
//     width: 1260,
//     height: 1260,
//   },
// ];

const fetchPins = async ({ pageParam, search, userId, boardId }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_ENDPOINT}/pins?cursor=${
      pageParam || ""
    }&search=${search || ""}&userId=${userId || ""}&boardId=${boardId || ""}` //using cursor for pagination
  );
  return res.data;
};
// This function fetches the pins from the server and returns them as an array

const Gallery = ({ search, userId, boardId }) => {
  // syntax for useQuery:
  //  const query = useQuery({
  //   queryKey: ["key"], // key to identify the query
  //   queryFn: fetchFunction, // function to fetch the data
  // })

  //syntax for useInfiniteQuery:
  // const query = useInfiniteQuery({
  //   queryKey: ["key"], // key to identify the query
  //   queryFn: fetchFunction, // function to fetch the data
  //   initialPageParam: 0, // initial page param
  //   getNextPageParam: (lastPage, pages) => lastPage.nextCursor, // function to get the next page param
  // });

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["pins", search], //add search to the query key to refetch the data when search changes
    queryFn: ({ pageParam = 0 }) => fetchPins({ pageParam, search, userId, boardId }),
    initialPageParam: 0, //we start from page 0
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  if (status === "pending") return <Skeleton/>;
  if (status === "error") return "Something went wrong...";

  const allPins = data?.pages.flatMap((page) => page.pins) || []; //we re gonna flatten the array of arrays into a single array i.e all the pages into a single array to show all the pins

  return (
    <InfiniteScroll //infinite scroll to trigger the next page(fetchNextPage) when we reach the end of the page
      dataLength={allPins.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more pins</h4>}
      endMessage={<h3>All Posts Loaded!</h3>}
    >
      <div className="gallery">
        {allPins?.map((item) => (
          <GalleryItem key={item._id} item={item} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default Gallery;