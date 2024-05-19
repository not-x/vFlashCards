import React, { useState, useEffect } from "react";
import Card from "../../components/Card"
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import { useParams, Link } from "react-router-dom";

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
        console.log("PrivSet route - type: " + typeof (card))
        console.log("PrivSet route - length: " + card.length)
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
                <h5>{(card === null || card.length === 0) ?
                    <Link to={"/profile/new/" + params.id}> Looks empty. Add some cards?</Link>
                    :
                    card[0].vfc_set_title}
                    <br></br>
                    {(card === null || card.length === 0) ?
                    <Link to={"/profile/autogen/" + params.id}> Or generate new cards. </Link>
                    :
                    ""}
                </h5>
                <p>
                    {(card === null || card.length === 0) ?
                        "" :
                        <Link to={"/profile/new/" + params.id} className="link-success link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">Add New Cards</Link>}
                    <br></br>

                    {(card === undefined || card.length === 0) ?
                        ""
                        : <Link to={"/profile/autogen/" + params.id} className="link-success link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">🤖 Generate New Cards 🤖</Link>}
                </p>


                {card.map((entryData) => (
                    console.log("entryData: " + entryData.vfc_set_title),
                    <Card {...entryData} key={entryData.vfc_id} />
                    // <CardSet {...entryData}  />
                ))}
            </div>
            <p>
                {(card === undefined || card.length === 0) ?
                    ""
                    : <Link to={"/profile/new/" + params.id} className="link-success link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">Add New Cards</Link>}
                <br></br>
                {(card === undefined || card.length === 0) ?
                    ""
                    : <Link to={"/profile/autogen/" + params.id} className="link-success link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">🤖 Generate New Cards 🤖</Link>}
            </p>
        </div>
    );
}
export default PrivSet