const ReccomendMovie = ({generateResponse}) => {
    return (
        <div className="col">
            <button className="btn btn-success btn-lg" type="submit" onClick={generateResponse}>
                Reccomend a Movie!
            </button>
        </div>
    )
}

export default ReccomendMovie