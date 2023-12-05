import React, { useState, useEffect } from "react";
import CardSet from "../../components/CardSet"
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import { useParams } from "react-router-dom";

function PrivateLib() {
    const [cardSets, setCardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
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
                setError(true);
            }
        }
        getData();
        return () => {
        };
    }, [params.id]);

    if (error) return <ErrorAlert details="Failed to fetch all vFlashCard sets" />;
    if (loading) return <LoadingSpinner />;
    // return <CardSet {...cardSets} key={cardSets.id}/>;
    // console.log(cardSets.map)
    return (
        <div className="container-fluid text-center">
            <div className="row justify-content-center">
                {cardSets.map((entryData) => (
                    // console.log("entryData: " + entryData.vfc_set_id),
                    <CardSet {...entryData} key={entryData.vfc_set_id} />
                    // <CardSet {...entryData}  />
                ))}
            </div>
        </div>
    );
}
export default PrivateLib