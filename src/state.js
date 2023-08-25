import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    types: [],
    allPokemon: [],
};

export const pokemonSlice = createSlice({
    name: "pokemon",
    initialState,
    reducers: {
        setTypes: (state, action) => {
            state.types = action.payload.types;
        },
        setAllPokemon: (state, action) => {
            state.allPokemon = action.payload.allPokemon;
        }
    }
})

export const { setTypes, setAllPokemon } = pokemonSlice.actions;
export default pokemonSlice.reducer;