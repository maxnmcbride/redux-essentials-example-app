import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Spinner } from '../../components/Spinner'
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';
import { selectAllPosts, fetchPosts, selectPostIds, selectPostById } from './postsSlice';

let PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId))
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
  const dispatch = useDispatch()
  const orderedPostIds = useSelector(selectPostIds)
  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    content = orderedPostIds.map(postId => (
      <PostExcerpt key={postId} postId={postId} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }

  // const orderedPosts = posts.slice().sort((a, b) => b.date.toString().localeCompare(a.date.toString()))

  // const renderedPosts = orderedPosts.map(post => {
  //   return (
  //     <article className="post-excerpt" key={post.id}>
  //       <h3>{post.title}</h3>
  //       <div>
  //         <PostAuthor userId={post.user} />
  //         <TimeAgo timestamp={post.date} />
  //       </div>
  //       <p className="post-content">{post.content.substring(0, 100)}</p>
  //       <ReactionButtons post={post} />
  //       <Link to={`posts/${post.id}`} className="button muted-button">
  //         View Post
  //       </Link>
  //     </article>
  //   )
  // })

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
      {/* {renderedPosts} */}
    </section>
  )
}
