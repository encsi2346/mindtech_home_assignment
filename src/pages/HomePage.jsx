import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Input,
    InputAdornment,
    ListItemText,
    MenuItem,
    Select,
    Typography,
    useMediaQuery
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useEffect, useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllPokemon, setTypes } from "../state";
import Loader from "react-js-loader";

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const types = useSelector((state) => state.types);
    const allPokemon = useSelector((state) => state.allPokemon);

    const [pokemonCollection, setPokemonCollection] = useState(allPokemon.length > 0 ? allPokemon : []);
    const [pokemonTypes, setPokemonTypes] = useState(types.length > 0 ? types : []);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('');
    const [temporaryCollection, setTemporaryCollection] = useState([]);
    const [indexes, setIndexes] = useState([]);
    const [basicDataRetrieved, setBasicDataRetrieved] = useState(false);
    const [detailsRetrieved, setDetailsRetrieved] = useState(false);
    const [loading, setLoading] = useState(false);

    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const getPokemonIndexes = async () => {
        try{
            setLoading(true);
            let tempPokemonCollection = [];
            let tempIndexes = [];
            await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10").then((response) => {
                const { results } = response.data;
                results.forEach((pokemon, index) => {
                    index++
                    let tempPokemonObject = {
                        id: index,
                        name: pokemon.name,
                        type: '',
                        status: '-',
                        weight: 0,
                        height: 0,
                        abilities: []
                    }
                    tempPokemonCollection.push(tempPokemonObject);
                    tempIndexes.push(tempPokemonObject.id);
                });
                setIndexes(tempIndexes);
            })
            setBasicDataRetrieved(true);
        } catch (error) {
            toast.error('Oops, something went wrong!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    const getPokemonDetails = async () => {
        try{
            let tempPokemonCollection = [];
            let tempIndexes = indexes;
            for (const item of tempIndexes) {
                let index = tempIndexes.indexOf(item);
                index++;
                await axios.get(`https://pokeapi.co/api/v2/pokemon/${item}`).then((response) => {
                    const results = response.data;
                    let tempPokemonObject = {
                        id: item,
                        name: results.name,
                        type: results.types[0].type.name,
                        status: '-',
                        weight: results.weight,
                        height: results.height,
                        abilities: [results.abilities[0].ability.name, results.abilities[1].ability.name]
                    }
                    tempPokemonCollection.push(tempPokemonObject);
                })}
            setTemporaryCollection(tempPokemonCollection);
            setDetailsRetrieved(true);
            setLoading(false);
        } catch (error) {
            toast.error('Oops, something went wrong!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    useEffect(() => {
        getPokemonIndexes().then();
        if (basicDataRetrieved === true) {
            getPokemonDetails().then();
        }
        getPokemonTypes();
    }, [basicDataRetrieved]); // eslint-disable-next-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (detailsRetrieved === true) {
            setPokemonCollection([...temporaryCollection]);
        }
    }, [temporaryCollection, detailsRetrieved]);

    useEffect(() => {
        dispatch(setAllPokemon({ allPokemon: pokemonCollection}));
    }, [dispatch, pokemonCollection]);

    const getPokemonTypes = () => {
        try {
            axios.get(`https://pokeapi.co/api/v2/type/`).then((response) => {
                const { results } = response.data;
                let tempTypesCollection = [];
                results.forEach((type, index) => {
                    index++
                    tempTypesCollection.push(type.name);
                });
                setPokemonTypes(tempTypesCollection);
            })
        } catch (error) {
            toast.error('Oops, something went wrong!', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    };

    useEffect(() => {
        dispatch(setTypes({ types: pokemonTypes}));
    }, [dispatch, pokemonCollection, pokemonTypes]);

    const handleCaughtPokemon = (pokemon) => {
       let tempPokemonObject = {
           id: pokemon.id,
           name: pokemon.name,
           type: pokemon.type,
           status: (pokemon.status !== 'Caught' ? 'Caught' : '-'),
           weight: pokemon.weight,
           height: pokemon.height,
           abilities: pokemon.abilities
        }
        const tempPokemonCollection = pokemonCollection.map((item) => {
            return (item.name === pokemon.name) ? (tempPokemonObject) : (item)
        });
        setPokemonCollection(tempPokemonCollection);
    }

    const handleSelectPokemon = (id) => {
        navigate(`/pokemon/${id}`, {
            state: {
                pokemonId: id,
            }
        });
    };

    const handleClickCheckBox = (e) => {
        if (searchType === 'checkbox') {
            setSearchType('input');
            setSearch('');
        } else {
            setSearchType('checkbox');
            setSearch(e.target.value);
        }
    }

    return (
        <Box>
            {isNonMobileScreens ? (
                <Box display='flex' >
                    <Box display='block' paddingLeft='213px'>
                        <Box display='block' marginBottom='30px' >
                            <Typography
                                marginTop='150px'
                                marginBottom='20px'
                                color='#6E6E6E'
                                fontSize='13px'
                                fontWeight='bold'
                            >
                                Filters
                            </Typography>
                            <FormControl>
                                <Input
                                    id="my-input"
                                    autoFocus
                                    onChange={(e) => { setSearch(e.target.value); setSearchType('input')}}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchRoundedIcon />
                                        </InputAdornment>
                                    }
                                    sx={{
                                        width: 360,
                                        height: 32,
                                        justifyContent:'center',
                                    }}
                                />
                            </FormControl>
                        </Box>
                        <Box display='block' marginBottom='30px' >
                            <Typography
                                marginBottom='20px'
                                color='#6E6E6E'
                                fontSize='13px'
                                fontWeight='bold'
                            >
                                Pokemon Types
                            </Typography>
                            <FormControl>
                                <Select
                                    displayEmpty
                                    placeholder='Select...'
                                    value={search}
                                    onChange={(e) => {setSearch(e.target.value); setSearchType('select')}}
                                    sx={{
                                        border:'2px',
                                        borderColor: '#EBEDED',
                                        borderRadius: '6px',
                                        width : '360px',
                                        height: '40px',
                                        '&:hover': {
                                            borderColor: '#A5A7A7',
                                            border:'2px',
                                        }
                                    }}
                                >
                                    {pokemonTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            <ListItemText primary={type} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ color: '#6E6E6E', fontSize: '13px', fontWeight: 'normal'}}>
                            <FormControlLabel control={<Checkbox onChange={(e) => handleClickCheckBox(e)}/>} label="Only show caught Pokemon" />
                        </Box>
                    </Box>

                    <Box sx={{ width: 413, marginTop: "150px", marginLeft: '200px'}}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'start',
                            justifyContent: 'flex-between',
                            color: '#6E6E6E',
                            gap: 10,
                            marginBottom: 7,
                        }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 'bold'}}>Name</Typography>
                            <Typography sx={{ fontSize: '13px', fontWeight: 'bold'}}>Type</Typography>
                            <Typography sx={{ fontSize: '13px', fontWeight: 'bold'}}>Status</Typography>
                        </Box>
                        {loading ? (
                            <Box display='flex' marginLeft={7}>
                                <Loader type="bubble-scale" bgColor={"#CC3B3B"} size={100} />
                            </Box>
                        ) : (
                            <Grid container rowSpacing={3}>
                                {pokemonCollection
                                    .filter((item) => {
                                        return search.toLowerCase() === ''
                                            ? item
                                            : (
                                                searchType === 'input' ?
                                                    item.name.toLowerCase().includes(search) :
                                                    searchType === 'select' ? item.type.toLowerCase().includes(search) :
                                                        item.status.toLowerCase().includes('caught')
                                            );
                                    })
                                    .map((item, index) => {
                                        return (
                                            <Grid container spacing={1}>
                                                <Grid container key={item.id} xs={9} onClick={() => handleSelectPokemon(item.id)}
                                                      sx={{
                                                          border: 1,
                                                          borderColor: item.status === '-' ? '#2E6EB5' : '#FFCB05',
                                                          borderRadius: '7px',
                                                          paddingTop: '5px',
                                                          paddingBottom: '5px',
                                                          paddingLeft: '15px',
                                                          paddingRight: '15px',
                                                          marginBottom: '10px',
                                                          gap: 4,
                                                          display: 'flex',
                                                          cursor: 'pointer',
                                                          fontSize: '13px'
                                                      }}>
                                                    <Grid item xs={3}>
                                                        {item.name}
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        {item.type}
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        {item.status}
                                                    </Grid>

                                                </Grid>
                                                <Grid item sx={3}>
                                                    <Button
                                                        onClick={() => handleCaughtPokemon(item)}
                                                        sx={{
                                                            backgroundColor: item.status === '-' ? '#2E6EB5' : '#FFCB05',
                                                            color: '#ffffff',
                                                            fontSize: '13px',
                                                            borderRadius: '7px',
                                                            paddingLeft: '10px',
                                                            paddingRight: '10px',
                                                            paddingTop: '5px',
                                                            paddingBottom: '5px',
                                                            textTransform: 'none'
                                                        }}
                                                    >
                                                        {item.status === '-' ? 'Catch' : 'Release'}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                            </Grid>
                        )}
                    </Box>

                    <ToastContainer />
                </Box>
            ) : (
                <Box>
                    <Box display='block' margin={3}>
                        <Box display='block' marginBottom='30px'>
                            <FormControl>
                                <Input
                                    id="my-input"
                                    autoFocus
                                    onChange={(e) => { setSearch(e.target.value); setSearchType('input')}}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SearchRoundedIcon />
                                        </InputAdornment>
                                    }
                                    sx={{
                                        width: 290,
                                        height: 32,
                                        justifyContent:'center',
                                    }}
                                />
                            </FormControl>
                        </Box>
                        <Box display='block' marginBottom='10px' >
                            <Typography
                                marginBottom='20px'
                                color='#6E6E6E'
                                fontSize='13px'
                                fontWeight='bold'
                            >
                                Pokemon Types
                            </Typography>
                            <FormControl>
                                <Select
                                    displayEmpty
                                    placeholder='Select...'
                                    value={search}
                                    onChange={(e) => {setSearch(e.target.value); setSearchType('select')}}
                                    sx={{
                                        border:'2px',
                                        borderColor: '#EBEDED',
                                        borderRadius: '6px',
                                        width : '290px',
                                        height: '40px',
                                        '&:hover': {
                                            borderColor: '#A5A7A7',
                                            border:'2px',
                                        }
                                    }}
                                >
                                    {pokemonTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            <ListItemText primary={type} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ color: '#6E6E6E', fontSize: '13px', fontWeight: 'normal'}}>
                            <FormControlLabel control={<Checkbox onChange={() => {setSearchType('checkbox')}}/>} label="Only show caught Pokemon" />
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%', marginTop: "20px", padding: 1, backgroundColor: '#CDDDEE'}}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'start',
                            justifyContent: 'flex-between',
                            color: '#6E6E6E',
                            gap: 5,
                            marginBottom: 7,
                        }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold'}}>Name</Typography>
                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold'}}>Type</Typography>
                            <Typography sx={{ fontSize: '12px', fontWeight: 'bold'}}>Status</Typography>
                        </Box>
                        <Grid container rowSpacing={3}>
                            {pokemonCollection
                                .filter((item) => {
                                    return search.toLowerCase() === ''
                                        ? item
                                        : (
                                            searchType === 'input' ?
                                                item.name.toLowerCase().includes(search) :
                                                searchType === 'select' ? item.type.toLowerCase().includes(search) :
                                                    item.status.toLowerCase().includes('caught')
                                        );
                                })
                                .map((item, index) => {
                                    return (
                                        <Grid container spacing={0.5}>
                                            <Grid container key={item.id} xs={9} onClick={() => handleSelectPokemon(item.id)}
                                                  sx={{
                                                      border: 1,
                                                      borderColor: item.status === '-' ? '#2E6EB5' : '#FFCB05',
                                                      borderRadius: '7px',
                                                      paddingTop: '5px',
                                                      paddingBottom: '5px',
                                                      paddingLeft: '5px',
                                                      paddingRight: '5px',
                                                      marginBottom: '10px',
                                                      gap: 2,
                                                      display: 'flex',
                                                      cursor: 'pointer',
                                                      fontSize: '12px'
                                                  }}>
                                                <Grid item xs={3}>
                                                    {item.name}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {item.type}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {item.status}
                                                </Grid>

                                            </Grid>
                                            <Grid item sx={3}>
                                                <Button
                                                    onClick={() => handleCaughtPokemon(pokemonCollection)}
                                                    sx={{
                                                        backgroundColor: item.status === '-' ? '#2E6EB5' : '#FFCB05',
                                                        color: '#ffffff',
                                                        fontSize: '12px',
                                                        borderRadius: '7px',
                                                        paddingLeft: '10px',
                                                        paddingRight: '10px',
                                                        paddingTop: '5px',
                                                        paddingBottom: '5px',
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    {item.status === '-' ? 'Catch' : 'Release'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                        </Grid>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default HomePage;