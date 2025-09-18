import { createSlice } from "@reduxjs/toolkit"


const courseSlice = createSlice({
    name:'course',
    initialState:{
       courseData:[]
    },
    reducers:{
      setCourseData:(state,action) => {
          state.courseData = action.payload
      }
    }
})

export const {setCourseData} = courseSlice.actions
export default courseSlice.reducer