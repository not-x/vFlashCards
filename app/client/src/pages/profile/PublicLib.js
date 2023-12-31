import React, { useState, useEffect } from "react";
import CardSetPub from "../../components/CardSetPub"
import LoadingSpinner from "../../components/LoadingSpinner";
import { useParams } from "react-router-dom";

function PublicLib() {
    const [cardSets, setCardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    let params = useParams();

    useEffect(() => {
        async function getData() {
            setLoading(true)
            try {
                let response = await fetch("/profile/pub_lib",
                    {
                        method: "GET",
                        headers: { token: localStorage.token }
                    });
                let postData = await response.json();
                // console.log(postData)
                setCardSets(postData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching /profile/pub_lib" + params.id, err);
            }
        }
        console.log("Inside PubLib. Getting data");
        getData();
        return () => {
        };
    }, [params.id]);

    if (loading) return <LoadingSpinner />;
    // return <CardSet {...cardSets} key={cardSets.id}/>;
    return (
        <div className="container-fluid text-center">
            <div className="row justify-content-center">
                <h5>{cardSets.length === 0 ? "Library is currently empty.": "" }</h5>
                {cardSets.map((entryData) => (
                    // console.log(entryData),
                    <CardSetPub {...entryData} key={entryData.vfc_set_id} />
                ))}
            </div>
        </div>
    )
}
export default PublicLib