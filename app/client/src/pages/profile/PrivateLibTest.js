import React, { useState, useEffect } from "react";
import CardSet from "../../components/CardSet"
import LoadingSpinner from "../../components/LoadingSpinner";
import { useParams } from "react-router-dom";

function PrivateLib() {
    const [cardSets, setCardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    let params = useParams();

    useEffect(() => {
        async function getData() {
            setLoading(true)
            try {
                let response = await fetch("/profile/lib",
                    {
                        method: "GET",
                        headers: { token: localStorage.token }
                    });
                let postData = await response.json();
                setCardSets(postData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching /profile/lib" + params.id, err);
            }
        }
        getData();
        return () => {
        };
    }, [params.id]);

    if (loading) return <LoadingSpinner />;
    // return <CardSet {...cardSets} key={cardSets.id}/>;
    // console.log(cardSets.map)
    return (
        <div className="container-fluid text-center">
            <div className="row justify-content-center">
                {cardSets.map((entryData) => (
                    <CardSet {...entryData} key={entryData.id} />
                    // <CardSet {...entryData}  />
                ))}
            </div>
        </div>
    )
}
export default PrivateLib