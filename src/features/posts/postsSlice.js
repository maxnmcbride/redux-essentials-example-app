import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client'
// import { sub } from 'date-fns'

const initialState = {
  posts: [],
  status: 'idle',
  error: null
}

// [
//   {
//     id: '1',
//     title: 'First Post!',
//     content: 'Hello!',
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     user: '0',
//     reactions: {
//       thumbsUp: 0,
//       hooray: 0,
//       heart: 0,
//       rocket: 0,
//       eyes: 0,
//     },
//   },
//   {
//     id: '2',
//     title: 'Second Post',
//     content: 'More text',
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     user: '2',
//     reactions: {
//       thumbsUp: 0,
//       hooray: 0,
//       heart: 0,
//       rocket: 0,
//       eyes: 0,
//     },
//   },
// ]

// don't try to mutate any data outside of createSlice!
// createSlice() converts mutations into safe immutable updates internally using the Immer library

export const addNewPost = createAsyncThunk(
  'posts/addnewPost',
  async initialPost => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      builder.addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload)
      })
  }
})
// we then export the action creator and use it in our components to 
// dispatch the action when the user clicks "save post" or "edit post":
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer;

export const selectAllPosts = state => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})
          // It's often a good idea to encapsulate data lookups by writing reusable selectors.
          // You can also create "memoized" selectors that can help improve performance,
          // which we'll look at in a later part of this tutorial.
          // But, like any abstraction, it's not something you should do all the time,
          // everywhere. Writing selectors means more code to understand and maintain. Don't
          // feel like you need to write selectors for every single field of your state.
          // Try starting without any selectors, and add some later when you find yourself
          // looking up the same values in many parts of your application code.