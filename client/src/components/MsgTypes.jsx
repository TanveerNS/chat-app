import { Box, Divider, IconButton, Link, Stack, Typography, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles'
import { DotsThreeVertical, DownloadSimple, Image } from 'phosphor-react';
import React from 'react';
import { Message_options } from '../data'

const DocMsg = ({ el, menu }) => {
    const theme = useTheme();
    return (
        <Stack direction='row' justifyContent={el.incoming ? 'start' : 'end'}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default :
                    theme.palette.primary.main, borderRadius: 1.5, width: 'max-content'
            }}>
                <Stack spacing={2}>
                    <Stack p={2} spacing={3} direction='row' alignItems='center'
                        sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
                        <Image size={48} />
                        <Typography variant='caption'>
                            Abstract.png
                        </Typography>
                        <IconButton>
                            <DownloadSimple />
                        </IconButton>
                    </Stack>
                    <Typography variant='body2' sx={{ color: el.incoming ? theme.palette.text : '#fff' }} >
                        {el.message}
                    </Typography>
                </Stack>
            </Box>
            {menu && <MessageOptions />}

        </Stack>
    )
}

const LinkMsg = ({ el, menu }) => {
    const theme = useTheme();
    return (
        <Stack direction='row' justifyContent={el.incoming ? 'start' : 'end'}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default :
                    theme.palette.primary.main, borderRadius: 1.5, width: 'max-content'
            }}>
                <Stack spacing={2}>
                    <Stack p={2} spacing={3} alignItems='start'
                        sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
                        <img src={el.preview} alt={el.message} style={{ maxHeight: 210, borderRadius: '10px' }} />
                        <Stack spacing={2}>
                            <Typography variant='subtitle2'>Creating Chat App</Typography>
                            <Typography variant='subtitle2' sx={{ color: theme.palette.primary.main }}
                                component={Link} to="//https://www.youtube.com">www.youtube.com</Typography>
                        </Stack>
                        <Typography variant='body2' color={el.incoming ? theme.palette.text : '#fff'}>
                            {el.message}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
            {menu && <MessageOptions />}
        </Stack>
    )
}

const ReplyMsg = ({ el, menu }) => {
    const theme = useTheme();
    return (
        <Stack direction='row' justifyContent={el.incoming ? 'start' : 'end'}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default :
                    theme.palette.primary.main, borderRadius: 1.5, width: 'max-content'
            }}>
                <Stack spacing={2}>
                    <Stack p={2} direction='column' spacing={3} alignItems='center'
                        sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 1 }}>
                        <Typography variant='body2' color={theme.palette.text}>
                            {el.message}
                        </Typography>
                    </Stack>
                    <Typography variant='body2' color={el.incoming ? theme.palette.text : '#fff'}>
                        {el.reply}
                    </Typography>
                </Stack>
            </Box>
            {menu && <MessageOptions />}
        </Stack>
    )
}

const MediaMsg = ({ el, menu }) => {
    const theme = useTheme();
    return (
        <Stack direction='row' justifyContent={el.incoming ? 'start' : 'end'}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default :
                    theme.palette.primary.main, borderRadius: 1.5, width: 'max-content'
            }}>
                <Stack spacing={1}>
                    <img src={el.img} alt={el.message} style={{ maxHeight: 210, borderRadius: '10px' }} />
                    <Typography variant='body2' color={el.incoming ? theme.palette.text : '#fff'}>
                        {el.message}
                    </Typography>
                </Stack>
            </Box>
            {menu && <MessageOptions />}
        </Stack>
    )
}

const TextMsg = ({ el, menu }) => {
    const theme = useTheme();
    return (
        <Stack direction='row' justifyContent={el.incoming ? 'start' : 'end'}>
            <Box p={1.5} sx={{
                backgroundColor: el.incoming ? theme.palette.background.default :
                    theme.palette.primary.main, borderRadius: 1.5, width: 'max-content'
            }}>
                <Typography variant='body2' color={el.incoming ? theme.palette.text : '#fff'}>
                    {el.message}
                </Typography>
            </Box>
            {menu && <MessageOptions />}
        </Stack>
    )
}

const TimeLine = ({ el }) => {
    const theme = useTheme();
    return <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Divider width='46%' />
        <Typography variant='caption' sx={{ color: theme.palette.text }}>
            {el.text}
        </Typography>
        <Divider width='46%' />
    </Stack>
}

const MessageOptions = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <DotsThreeVertical
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                size={20}
            />

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Stack spacing={1} px={1}>
                    {Message_options.map((el) => (
                        <MenuItem onClick={handleClick}>{el.title}</MenuItem>
                    ))}
                </Stack>
            </Menu>
        </>
    )
}

export { TimeLine, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg }