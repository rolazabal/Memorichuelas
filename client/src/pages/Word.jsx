function Word({uID, wID, api}) {

	const [word, setWord] = useState(null);

	const { strings } = useContext(LocContext);
        const { toasts, showToast } = useContext(ToastContext);

	function getWord(id) {
		try {
			let res = fetch(api + "/word/" + id, {
				method: 'GET'
			});
			res = res.json();
			let word = res.word;
			setWord(word);
		} catch(error) { showToast(toasts.ERR); }
	}

	useEffect(() => {
		getWord(wID);
	}, []);

	return (
		<>
			<Row>
				<Card.Title>
					{strings.get("dictionary_title")}
				</Card.Title>
			</Row>
			<Container style={{padding: "0", maxHeight: "90%", overflowY: "auto", overflowX: "hidden"}}>
				{word != null && <>
					<Stack direction="horizontal">
						<h2>{word.name}</h2>
						<Button className="ms-auto" onClick={async () => {await setWord(null)}}>
							{strings.get("back")}
						</Button>
					</Stack>
					{word.defs.length > 0 && <ul>
						{word.defs.map((def) => <li>
							{def}
						</li>)}	
					</ul>}
					{word.exs.length > 0 && <>
						<h3>{strings.get("example")}</h3>
						<ul>
							{word.exs.map((ex) => <li>
								{ex}
							</li>)}
						</ul>
					</>}
				</>}
			</Container>
		</>
	);
}

export default Word
