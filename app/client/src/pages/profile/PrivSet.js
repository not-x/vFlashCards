import React, { useState, useEffect } from "react";
import Card from "../../components/Card"
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import { useParams } from "react-router-dom";

function PrivSet() {
    const [card, setCard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    let params = useParams();

    useEffect(() => {
        async function getData() {
            setLoading(true)
            try {
                let response = await fetch("/profile/lib/" + params.id,
                    {
                        method: "GET",
                        headers: { token: localStorage.token }
                    });
                let postData = await response.json();
                setCard(postData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching /profile/lib/" + params.id, err);
                setError(true);
            }
        }
        getData();
        return () => {
        };
    }, [params.id]);

    if (error) return <ErrorAlert details="Failed to fetch all flashcards" />;
    if (loading) return <LoadingSpinner />;
    // return <CardSet {...cardSets} key={cardSets.id}/>;
    // console.log(card.map)
    return (
        <div className="container-fluid text-center">
            <div className="row justify-content-center">
                <p>{card.length === 0 ? "Empty Set. Time to add some cards?" : card[0].vfc_set_title}</p>
                {card.map((entryData) => (
                    console.log("entryData: " + entryData.vfc_set_title),
                    <Card {...entryData} key={entryData.vfc_id} />
                    // <CardSet {...entryData}  />
                ))}
            </div>
        </div>
    );
}
export default PrivSet