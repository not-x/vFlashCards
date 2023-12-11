import React, { useState, useEffect } from "react";
import CardPub from "../../components/CardPub"
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import { useParams } from "react-router-dom";

function PubSet() {
    const [card, setCard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    let params = useParams();

    useEffect(() => {
        async function getData() {
            setLoading(true)
            try {
                let response = await fetch("/profile/pub_lib/" + params.id,
                    {
                        method: "GET",
                        headers: { token: localStorage.token }
                    });
                let postData = await response.json();
                setCard(postData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching /profile/pub_lib/" + params.id, err);
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
                <h5>{card.length === 0 ? "Empty Set. Author has not added any cards yet." : card[0].vfc_set_title}</h5>
                {card.map((entryData) => (
                    console.log("entryData: " + entryData.vfc_set_title),
                    <CardPub {...entryData} key={entryData.vfc_id} />
                    // <CardSet {...entryData}  />
                ))}
            </div>
        </div>
    );
}
export default PubSet