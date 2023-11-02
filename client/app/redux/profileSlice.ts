import {createSlice} from '@reduxjs/toolkit'

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        username: '',
        firstName: '',
        lastName: '',
        isAdmin: false
    },
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        setLastName: (state, action) => {
            state.lastName = action.payload;
        },
        setIsAdmin: (state, action) => {
            state.isAdmin = action.payload;
        }
    }
})

export const {setFirstName, setLastName, setFavoriteGame, setUsername, setIsAdmin} = profileSlice.actions

export const fetchUserInformation = () => (dispatch) => {
    return fetch('http://localhost:9090/users/' + sessionStorage.getItem('userId') + '?token=' + sessionStorage.getItem('token'), {
        method: 'GET',
    }).then((response) => {
        if (response.ok) {
            return response.json().then((_body) => {
                dispatch(setUsername(_body.username));
                dispatch(setFirstName(_body.firstName || ''));
                dispatch(setLastName(_body.lastName || ''));
                dispatch(setIsAdmin(_body.admin));
            });
        }
        throw {
            status: response.status,
            statusText: response.statusText
        };
    })
};

export const updateUser = () => (dispatch, state) => {
    return fetch('http://localhost:9090/users/' + sessionStorage.getItem('userId') + '?token=' + sessionStorage.getItem('token'), {
        method: 'PATCH', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify({
            firstName: state().profile.firstName,
            lastName: state().profile.lastName
        }),
    }).then((response) => {
        if (response.ok) {
            return;
        }
        throw {
            status: response.status,
            statusText: response.statusText
        };
    })
}

export default profileSlice.reducer