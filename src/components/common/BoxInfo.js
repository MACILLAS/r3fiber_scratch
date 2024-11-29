const BoxInfo = ({ name, description, setName, setDescription }) => {
    const styles = {
        container: {
            display: "flex",
            flexDirection: "column", 
            alignItems: "center",
            padding: "10px",
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: "5px",
            color: "white"
        }
    };

    return (
        <div style={styles.container}>
            <form>
                <label htmlFor="fname">Name:</label><br/>
                <input 
                    type="text"
                    id="fname"
                    name="fname" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                /><br/>
                <label htmlFor="fdescription">Description:</label><br/>
                <input
                    type="text"
                    id="fdescription"
                    name="fdescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </form>
        </div>
    );
};

export default BoxInfo;
