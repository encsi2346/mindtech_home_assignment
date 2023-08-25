import { useState } from 'react';
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { Menu } from '@mui/icons-material';
import logo from '../assets/pokeapi_logo.png'
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const Navbar = () => {
    const navigate = useNavigate();
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <Box display='flex' alignItems='center' justifyContent='center' padding="1rem 6%" backgroundColor={'#CC3B3B'}>
            {isNonMobileScreens ? (
                <Box display='flex' alignItems='center' justifyContent='center' padding="1rem 6%" backgroundColor={'#CC3B3B'}>
                    <Box display='flex' alignItems='center' paddingX={'47px'} onClick={() => navigate('/')} sx={{ cursor: 'pointer'}}>
                        <img
                            width={177}
                            height={65}
                            alt={'pokeapi'}
                            src={`${logo}`}
                        />
                    </Box>
                    <Box width={248} height={21} display='flex' alignItems='center' paddingLeft='1250px' marginRight='54px'>
                        <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Typography fontSize='21px' color={'#ffffff'} sx={{ cursor: 'pointer'}}>
                                PokeAPI Documentation
                            </Typography>
                        </a>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <FlexBetween gap="1.75rem">
                        <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer'}}>
                            <img
                                width={177}
                                height={65}
                                alt={'pokeapi'}
                                src={`${logo}`}
                            />
                        </Box>
                    </FlexBetween>
                    <Box position="fixed" left="0" top="0" marginTop={4} marginLeft={2}>
                        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                            <Menu sx={{ color: '#ffffff'}} />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {!isNonMobileScreens && isMobileMenuToggled && (
                <Box
                    position="fixed"
                    left="0"
                    top="0"
                    marginTop={12}
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="300px"
                    backgroundColor={'#AC3636'}
                >
                    <FlexBetween display="flex" flexDirection="column" justifyContent="center" aligntItems="center" padding="1.5rem" gap="3rem">
                        <FlexBetween gap="2rem">
                            <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <Typography fontSize='21px' color={'#ffffff'} sx={{ cursor: 'pointer'}}>
                                    PokeAPI Documentation
                                </Typography>
                            </a>
                        </FlexBetween>
                    </FlexBetween>
                </Box>
            )}
        </Box>
    );
};

export default Navbar;