import React, { useRef, useEffect, useState } from "react"
import Link from "next/link"
import NavBar from "../components/Navbar"
import { makeStyles, fade } from "@material-ui/core/styles"
import {
  Typography,
  Grid,
  Paper,
  Link as MuiLink,
  Divider,
} from "@material-ui/core"
import { getPosts } from "../data/blog"
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import Fade from "react-reveal/Fade"
import Head from "next/head"
import Transition from "react-transition-group/Transition"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",

    backgroundColor: "#2b313c",
    //backgroundImage: "url('/static/images/interlaced.png')",
    color: theme.palette.common.black,
    marginTop: theme.spacing(5),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(8),
    },
  },

  postsGridContainer: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(8),
  },

  postGridItem: {
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(2),
    },
    paddingBottom: theme.spacing(2),

    width: "700px",
    maxWidth: "100%",

    "&:hover": {
      transform: "scale(1.1)",
    },

    transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "scale(1, 1)",
  },

  titleGridItem: {
    paddingTop: theme.spacing(3),
    //paddingBottom: theme.spacing(3),
    backgroundColor: "#2b313c",
    width: "100%",
    //boxShadow: "inset 0 0 20px rgba(0,0,0,.5)",
    color: theme.palette.common.white,
  },

  textSecondary: {
    //color: "rgba(0, 0, 0, 0.54)",
  },

  postPaper: {
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(4),
    },
    //borderLeft: "1px solid transparent",
    padding: theme.spacing(3),
    transition: theme.transitions.create("background-color"),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    cursor: "pointer",
    borderRadius: "3px",
    backgroundColor: "rgba(255,255,255, 0.1)",
    //color: "black",
  },

  titleFont: {
    fontWeight: 100,
  },

  previewImageAvatar: {
    //margin: 10,
    width: 230,
    height: 150,
    marginLeft: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "3px",
  },

  readMoreButton: {
    //bottom: 0,
    //margin: theme.spacing(1),
    //color: "white",
  },

  divider: {
    marginLeft: theme.spacing(4),

    marginRight: theme.spacing(4),
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
}))

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => {
      return <Typography>{children}</Typography>
    },
    [BLOCKS.HEADING_1]: (node, children) => (
      <Typography variant="h6">{children}</Typography>
    ),
  },
}

const Blog = ({ posts }) => {
  const classes = useStyles()

  const duration = 500

  const defaultStyle = {
    transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
    opacity: 0,
    transform: "scale(0)",
    willChange: "transform",
  }

  const transitionStyles = {
    entering: { opacity: 0, transform: "scale(0)" },
    entered: { opacity: 1, transform: "scale(1, 1)" },
  }

  return (
    <>
      <Head>
        <title>Blog | Jordan Portfolio</title>
        <meta name="description" content="My Personal Blog" />
      </Head>
      <NavBar />
      <div className={classes.root}>
        <div className={classes.titleGridItem}>
          <Typography
            align="center"
            variant="h3"
            className={classes.titleFont}
            gutterBottom
          >
            Welcome to my Blog
          </Typography>
          <Typography align="center" color="textSecondary">
            Various posts about tech and my life.
          </Typography>
        </div>

        <Grid
          container
          justify="center"
          className={classes.postsGridContainer}
          direction="column"
          alignItems="center"
        >
          {posts
            .sort((a, b) => {
              return new Date(b.publishedAt) - new Date(a.publishedAt)
            })
            .map((post, index) => (
              <Grid item className={classes.postGridItem} key={post._id}>
                {index === 0 && <Divider variant="middle" />}
                <Transition key={index} in={true} appear={true} timeout={0}>
                  {state => (
                    <div
                      style={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                        transitionDelay: (index - 1) * 125 + "ms",
                      }}
                    >
                      <Link
                        href={{
                          pathname: `/post`,
                          query: { id: post._id },
                        }}
                        as={`/post/${post.slug.current}`}
                      >
                        <Paper elevation={4} className={classes.postPaper}>
                          <Grid
                            container
                            justify="flex-start"
                            direction="column"
                            spacing={2}
                          >
                            <Grid item>
                              <Grid container alignItems="center">
                                <Grid item xs>
                                  <Typography
                                    variant="h4"
                                    className={classes.titleFont}
                                    gutterBottom
                                  >
                                    {post.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    gutterBottom
                                    className={classes.textSecondary}
                                    color="textSecondary"
                                  >
                                    {new Date(post._createdAt).toDateString()}
                                  </Typography>
                                  <Typography>
                                    {post.description}
                                    <MuiLink className={classes.readMoreButton}>
                                      {" "}
                                      Read More
                                    </MuiLink>
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  {post.previewImage && (
                                    <div className={classes.previewImageAvatar}>
                                      <img
                                        src={post.previewImage}
                                        style={{ height: "100%" }}
                                        alt="preview"
                                      />
                                    </div>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Link>
                    </div>
                  )}
                </Transition>
              </Grid>
            ))}
        </Grid>
      </div>
    </>
  )
}

Blog.getInitialProps = async () => {
  return { posts: await getPosts() }
}

export default Blog
