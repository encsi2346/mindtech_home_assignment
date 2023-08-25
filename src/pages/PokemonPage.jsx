import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { setAllPokemon } from "../state";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .MuiDataGrid-columnHeaders`]: {
        display: 'none'
    },
    [`& .MuiDataGrid-footer`]: {
        display: 'none'
    },
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: '#2E6EB53C',
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha('#2E6EB53C', 0.2),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
    [`& .${gridClasses.row}.odd`]: {
        backgroundColor: '#FFCB053D',
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha('#FFCB053D', 0.2),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));

const PokemonPage = ({ pokemonId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state.pokemonId;
    const allPokemon = useSelector((state) => state.allPokemon);
    const [selectedPokemon, setSelectedPokemon] = useState({
        name: '',
        id: '',
        type: '',
        status: '-',
        weight: 0,
        height: 0,
        abilities: []
    });

    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    useEffect( () => {
        const tempPokemonObject = allPokemon.find((item) => item.id === id);
        setSelectedPokemon(tempPokemonObject);
    }, [allPokemon, id, pokemonId, setSelectedPokemon]);

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
        const tempPokemonCollection = allPokemon.map((item) => {
            return (item.name === pokemon.name) ? (
                tempPokemonObject
            ) : (
                item
            )
        });
        dispatch(setAllPokemon({ allPokemon: tempPokemonCollection}));
    }

    const columns = [
        {
            field: 'header',
            headerName: 'Header',
            width: 100,
        },
        {
            field: 'data',
            headerName: 'Data',
            width: 150,
        },
    ];

    const rows = [
        {
            id: 1,
            header: 'Name',
            data: selectedPokemon.name,
        },
        {
            id: 2,
            header: 'Weight',
            data: selectedPokemon.weight,
        },
        {
            id: 3,
            header: 'Height',
            data: selectedPokemon.height,
        },
        {
            id: 4,
            header: 'Abilities',
            data: selectedPokemon.abilities,
        },
        {
            id: 5,
            header: 'Status',
            data: selectedPokemon.status,
        },
    ];

    return (
        <Box>
            {isNonMobileScreens ? (
                <Box display='flex' alignItems='center' justifyContent='center' marginTop={15}>
                    <Box onClick={() => navigate(-1)} sx={{ display: 'flow', cursor: 'pointer' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center',marginBottom: 1, color: '#676D74'}}>
                            <KeyboardBackspaceIcon sx={{ marginRight: 1}} />
                            <Typography sx={{fontSize: '21px', fontWeight: 'bold'}}>
                                Back to search
                            </Typography>
                        </Box>
                        <Box sx={{ width: '505px', height: '415px', border: 5, borderColor: selectedPokemon.status === '-' ? '#2E6EB5' : '#FFCB05'}}>
                            <img
                                width='505px'
                                height='415px'
                                alt={selectedPokemon.name}
                                src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + selectedPokemon.id + ".png"}
                            />
                        </Box>
                    </Box>

                    <Box display='block' marginLeft='79px'>
                        <Box style={{ height: 415, width: 277, fontSize: '21px' }}>
                            <StripedDataGrid
                                rows={rows}
                                columns={columns}
                                hideFooter
                                hideFooterRowCount
                                hideFooterSelectedRowCount
                                hideFooterPagination
                                rowHeight={40}
                                getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                }
                            />
                        </Box>
                        <Button
                            onClick={handleCaughtPokemon}
                            sx={{
                                backgroundColor: selectedPokemon.status === '-' ? '#2E6EB5' : '#FFCB05',
                                color: '#ffffff',
                                fontSize: '13px',
                                borderRadius: '7px',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                paddingTop: '5px',
                                paddingBottom: '5px',
                                textTransform: 'none',
                                width: '277px',
                                height: '33px',
                                marginTop: '62px'
                            }}
                        >
                            {selectedPokemon.status === '-' ? 'Catch' : 'Release'}
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box display='block' alignItems='center' justifyContent='center' margin={2}>
                    <Box onClick={() => navigate(-1)} sx={{ display: 'flow', cursor: 'pointer' }} >
                        <Box sx={{ width: '305px', height: '281px', border: 5, borderColor: selectedPokemon.status === '-' ? '#2E6EB5' : '#FFCB05'}}>
                            <img
                                width='305px'
                                height='281px'
                                alt={selectedPokemon.name}
                                src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + selectedPokemon.id + ".png"}
                            />
                        </Box>
                    </Box>

                    <Box display='block' marginTop={4}>
                        <Box sx={{ height: 260, width: 305, backgroundColor: '#2E6EB53C' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                hideFooter
                                hideColumnsHeader
                                hideFooterPagination
                                hideFooterSelectedRowCount
                                headerHeight={0}
                                disableColumnMenu
                                rowHeight={40}
                                columnHeaderHeight={0}
                            />
                        </Box>
                        <Button
                            onClick={handleCaughtPokemon}
                            sx={{
                                backgroundColor: selectedPokemon.status === '-' ? '#2E6EB5' : '#FFCB05',
                                color: '#ffffff',
                                fontSize: '13px',
                                borderRadius: '7px',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                paddingTop: '5px',
                                paddingBottom: '5px',
                                textTransform: 'none',
                                width: '305px',
                                height: '33px',
                                marginTop: 4
                            }}
                        >
                            {selectedPokemon.status === '-' ? 'Catch' : 'Release'}
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default PokemonPage;