import React from "react";
import { withStyles } from "@material-ui/core";

import { t } from "../utils/t";
import { HISTORY } from "../utils/constants";

import {Fade, Button, LinearProgress, IconButton} from "@material-ui/core";

import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import CloseIcon from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import api from "../utils/api";
import actions from "../actions/utils";

const styles = theme => ({
    "@keyframes innerToolbarCyberPunkAnimation": {
        "0%": { left: "-20%"},
        "100%": { left: "70%"}
    },
    root: {
        display: "flex",
        position: "relative",
        width: "100%",
    },
    innerToolbar: {
        cursor: "pointer",
        height: 40,
        lineHeight: "40px",
        borderRadius: 4,
        display: "flex",
        position: "relative",
        width: "100%",
        overflow: "auto",
        textTransform: "none",
        textAlign: "inherit",
        padding: 0,
        boxShadow: "inset 0px 0px 24px #1b358c57",
        backgroundColor: theme.palette.secondary.main, // #030435
        backgroundImage: `url("data:image/png;base64,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")`,
        backgroundPosition: "center",
        "&:hover": {
            backgroundColor: theme.palette.secondary.lighter,
        },
        color: "#d7dbff",
        "&::before": {
            display: "flex",
            top: 0,
            left: "-30%",
            "content": "\"\"",
            position: "absolute",
            height: 40,
            width: "60%",
            background: "linear-gradient(to right, transparent, rgb(155 163 220 / 33%), transparent)",
            animation: "$innerToolbarCyberPunkAnimation 7.7s linear alternate infinite",
        },
        backColor: "#6c72b72e",
        //boxShadow: "inset 0px 0px 6px #475db3ab, inset 0px 0px 24px #838fdc61, inset 0px 0px 48px #cbd4ff40",
        "&::-webkit-scrollbar": {
            display: "none"
        }
    },
    link: {
        color: "#d7dbff",
        textDecoration: "none",
        height: "100%",
        lineHeight: "100%",
        display: "inline-block",
        fontSize: "15px"
    },
    linkIcon: {
        color: "#7479b4",
        marginLeft: 8,
        textDecoration: "none",
        height: "100%",
        lineHeight: "100%",
        display: "inline-block",
        fontSize: "12px"
    },
    innerToolbarTextWrapperContainer: {
        position: "absolute",
        width: "100%",
        top: 0,
    },
    innerToolbarTextWrapper: {
        position: "absolute",
        width: "100%"
    },
    innerToolbarInput: {
        position: "relative",
        width: "100%",
        display: "block",
    },
    innerToolbarText: {
        whiteSpace: "nowrap",
        position: "relative",
        width: "100%",
        display: "block",
        textShadow: `0px 0px ${theme.spacing(1)}px ${theme.palette.secondary.light}`,
        "& > *:first-child": {
            marginLeft: theme.spacing(1),
        },
        "& > *:last-child": {
            marginRight: theme.spacing(1),
        },
    },
    innerToolbarProgress: {
        position: "inherit",
        display: "flex",
        width: "100%",
    },
    linearProgressVisible: {
        "& .MuiLinearProgress-barColorPrimary": {
            background: "linear-gradient(90deg, rgb(52 58 103) 0%, rgb(31 36 80) 100%)",
            zIndex: -1,
        },
        zIndex: 1,
        marginBottom: -3,
        height: 3,
        backgroundColor: "transparent",
        width: "50%",
        display: "flex",
    },
    linearProgressVisibleOffline: {
        "& .MuiLinearProgress-barColorPrimary": {
            background: `linear-gradient(90deg, ${theme.palette.primary.actionRed} 0%, ${"rgb(155 163 220 / 0%)"} 100%);`,
            zIndex: -1,
        },
        zIndex: 1,
        marginBottom: -3,
        height: 3,
        backgroundColor: "transparent",
        width: "50%",
        display: "flex",
    },
    infoIcon: {
        right: 0,
        top: 0,
        height: "100%",
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.primary.contrastText,
        zIndex: 2,
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 0, 1, 1),
        paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
        width: '100%',
        "input&::placeholder": {
            color: "#d7dbff",
            opacity: .666,
            fontSize: "15px"
        }
    },
});

class InnerToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: props.pathname,
            logged_account: props.logged_account,
            know_if_logged: props.know_if_logged,
            loaded_progress_percent: props.loaded_progress_percent,
            music_enabled: props.music_enabled,
            classes: props.classes,
            _is_info_bar_active: false,
            _history: HISTORY,
        };
    };

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(new_props) {

        const state = {
            ...new_props,
            _is_info_bar_active: new_props.pathname.includes("pixel") ? this.state._is_info_bar_active: false
        };

        this.setState(state);
    }

    _toggle_info_bar_activation = () => {

        let { _is_info_bar_active } = this.state;
        if(!_is_info_bar_active) {

            window.dispatchEvent(new Event("art-action-gethelp"));
        }
        this.setState({_is_info_bar_active: !_is_info_bar_active});
    };

    _trigger_tip = (text) => {

        actions.trigger_snackbar(text, 60 * 1000);
        actions.trigger_sfx("navigation_selection-complete-celebration");
    };

    _go_to = (url) => {

        const { _history } = this.state;
        _history.push(url);
    };

    _on_settings_changed = () => {

        actions.trigger_loading_update(0);
        setTimeout(() => {

            actions.trigger_loading_update(100);
        }, 250);

        actions.trigger_settings_update();
    }

    _handle_music_enabled_switch_change = () => {

        const checked = Boolean(this.state.music_enabled);

        if(checked){

            actions.trigger_sfx("ui_lock");
            actions.stop_sound();
        }else {

            actions.trigger_sfx("ui_unlock");
        }

        const settings = { music_enabled: !checked };
        this.setState({music_enabled: !checked});
        api.set_settings(settings,  this._on_settings_changed);
    };

    render() {

        const { classes, pathname, logged_account, know_if_logged, loaded_progress_percent, _is_info_bar_active, music_enabled } = this.state;

        let pathname_splitted = pathname.split("/");
        pathname_splitted.shift();

        const pathame_items = pathname_splitted.map((element, index, array) => {

            let link_to = "/";
            for (let i = 0; i <= index; i++) {

                link_to += array[i] + (i === index ? "": "/");
            }


            return element === "" ? null: <Fade in={know_if_logged}  key={index}><a key={index} onClick={() => {this._go_to(link_to)}} className={classes.link} >&nbsp;›&nbsp;{element}</a></Fade>;
        });

        const tip_items = [
            <Fade in={true}><a key="tip-legend" onClick={() => {this._trigger_tip(`(?) Aware it musts be working as intended, tips are to be used left to right in chronological order while asterisks means mandatory for completion.`)}} className={classes.link}>&nbsp;STEPS / HINTS&nbsp;›&nbsp;</a></Fade>,
            <Fade in={true}><a key="tip-deepai" onClick={() => {this._trigger_tip(`(?) DeepAI.org (remote) system (2nd tab) in editing area, can add colors to monochromatic images and upscale it if ONLY you choose to. AI doesn't mean results can't be wrong but algorithms are absolute.`)}} className={classes.link}>&nbsp;+AI&nbsp;→&nbsp;</a></Fade>,
            <Fade in={true}><a key="tip-contrast" onClick={() => {this._trigger_tip("(?) In photography, darkest and lightest tones looks better if they are more distant from each other. Double-tap or Right-click around the movable and drawing card area to open the context-menu containing the related tools.")}} className={classes.link}>&nbsp;+Contrasts&nbsp;→&nbsp;</a></Fade>,
            <Fade in={true}><a key="tip-colors" onClick={() => {this._trigger_tip("(?) For a pixel art to get nice, your palette needs to contain less colors than 8-128 for greatness. Double-tap or Right-click around the movable and drawing card area to open the context-menu containing the related tools.")}} className={classes.link}>&nbsp;-Colours*&nbsp;→&nbsp;</a></Fade>,
            <Fade in={true}><a key="tip-smooth" onClick={() => {this._trigger_tip(`(?) For a pixel art to get neat, you can raid the "smooth" functionality available in menu on double-tap or right-click. All your pixel should live with similar neighbors 6/8 because in towns that isn't thought "smooth or fancy" algorithmic raids will adopts neighbour's color for lonely pixel repainting.`)}} className={classes.link}>&nbsp;+Smoother&nbsp;→&nbsp;</a></Fade>,
            <Fade in={true}><a key="tip-filters" onClick={() => {this._trigger_tip(`(?) In popular social media around pictures, it is popular to let colors being moved from given properties to other ones, creating sometimes colourful effects looking regularized. 7 Sections in the panel of editing contains one called "Filters" (7/7) to apply an adjustable color correction strength out of 21+ preview.`)}} className={classes.link}>&nbsp;+Filters&nbsp;→&nbsp;</a></Fade>,
            <Fade in={true}><a key="tip-export" onClick={() => {this._trigger_tip(`(?) The nostalgia caused by legendary video games had let remastering find faithful solutions in saving fan's eyes on yet 2x or 3x up-scaled screen resolution using original visuals while up-scaled with intelligent rules only to cover just more precisely the same area while seeking beauty out of changes regarding pixel's neighbour tiny house. The 2nd panel section about "Images" let you export and multiply from up to 32x with crisp-edge your artwork before download, more impressively if it empathize no more than 128 colors, also by 6x creating very cool near-human shapes which the application reads to save resulting shapes by colors in a file that scales up to employ every living pixel on screen / printing unit on paper that aren't disabled.`)}} className={classes.link}>&nbsp;+Render*&nbsp;</a></Fade>,
        ];

        return (
            <div className={classes.root}>
                <Button className={classes.innerToolbar} style={pathname.split("/")[1] === "gallerybutnotnowatleast" ? {backgroundBlendMode: "difference", backgroundImage: `linear-gradient(-9deg, rgb(163 238 244) 5%, rgb(101 125 255) 43%, rgb(198 5 247 / 95%) 100%), url(data:image/png;base64,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)`}: {}} disableFocusRipple>
                    <span className={classes.innerToolbarTextWrapperContainer}>
                        <span className={classes.innerToolbarTextWrapper}>
                            <div className={classes.innerToolbarProgress}>
                                <LinearProgress
                                    color="primary"
                                    variant="determinate"
                                    aria-progressbar-name={"main-progressbar-left"}
                                    className={navigator.onLine ? classes.linearProgressVisible: classes.linearProgressVisibleOffline}
                                    value={100 - loaded_progress_percent}
                                    style={{transform: "rotate(-180deg)", webkitTransform: "rotate(-180deg)"}}/>
                                <LinearProgress
                                    color="primary"
                                    variant="determinate"
                                    aria-progressbar-name={"main-progressbar-right"}
                                    className={navigator.onLine ? classes.linearProgressVisible: classes.linearProgressVisibleOffline}
                                    value={100 - loaded_progress_percent} />
                            </div>
                            <span className={classes.innerToolbarText} style={pathname.includes("gallery") ? {width: "calc(100% - 36px)", overflow: "overlay"}: {}}>
                                {!_is_info_bar_active && <Fade in={know_if_logged}><a className={classes.link} onClick={() => {this._go_to(logged_account ? "/": "/")}}>{know_if_logged ? logged_account ? logged_account.name: t( "components.inner_toolbar.guest"): ""} </a></Fade>}
                                {!_is_info_bar_active && pathame_items}
                                {_is_info_bar_active && tip_items}
                            </span>
                        </span>
                    </span>
                </Button>
                <IconButton aria-label="main-account-button" style={pathname.includes("/pixel") ? {}: {display: "none"}} className={classes.infoIcon} onClick={this._toggle_info_bar_activation}>
                    {_is_info_bar_active ? <CloseIcon />: <InfoIcon />}
                </IconButton>
                <IconButton aria-label="current-page-options-button" style={pathname === "/" ? {}: {display: "none"}} className={classes.infoIcon} onClick={this._handle_music_enabled_switch_change}>
                    {music_enabled ? <VolumeOffIcon />: <VolumeUpIcon />}
                    {music_enabled ? <span className={classes.linkIcon}> RedEclipse - Ωst</span>: <span className={classes.linkIcon}> MUSIC?!</span>}
                </IconButton>
            </div>
        );
    }
}

export default withStyles(styles)(InnerToolbar);
