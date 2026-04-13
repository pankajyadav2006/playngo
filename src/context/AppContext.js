import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { appReducer, initialState, actionTypes } from './appReducer';
import { venueAPI, bookingAPI } from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { user, isAuthenticated } = useAuth();


    useEffect(() => {
        loadVenues();
    }, []);


    useEffect(() => {
        if (isAuthenticated && user) {
            loadBookings();
        }
    }, [isAuthenticated, user]);

    const loadVenues = async () => {
        try {
            console.log('📍 Loading venues...');
            dispatch({ type: actionTypes.SET_LOADING, payload: true });
            const response = await venueAPI.getAll();
            console.log('✅ Venues loaded:', response.data.venues?.length, 'venues');
            console.log('📋 Venues:', JSON.stringify(response.data.venues, null, 2));
            dispatch({ type: actionTypes.SET_VENUES, payload: response.data.venues });
        } catch (error) {
            console.error('❌ Failed to load venues:', error);
            dispatch({ type: actionTypes.SET_ERROR, payload: 'Failed to load venues' });
        } finally {
            dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
    };

    const loadBookings = async () => {
        try {
            const response = await bookingAPI.getMyBookings();
            dispatch({ type: actionTypes.SET_BOOKINGS, payload: response.data.bookings });
        } catch (error) {
            console.error('Failed to load bookings:', error);
        }
    };


    const addBooking = async (bookingData) => {
        try {
            const response = await bookingAPI.createBooking(bookingData);
            const newBooking = response.data.booking;
            dispatch({ type: actionTypes.ADD_BOOKING, payload: newBooking });

            return { success: true, booking: newBooking, message: response.data.message };
        } catch (error) {
            console.error('Failed to create booking:', error);
            const message = error.response?.data?.error || 'Failed to create booking';
            return { success: false, error: message };
        }
    };


    const cancelBooking = async (bookingId) => {
        try {
            await bookingAPI.cancelBooking(bookingId);
            dispatch({ type: actionTypes.CANCEL_BOOKING, payload: bookingId });
            return { success: true };
        } catch (error) {
            console.error('Failed to cancel booking:', error);
            const message = error.response?.data?.error || 'Failed to cancel booking';
            return { success: false, error: message };
        }
    };

    const toggleFavorite = (venueId) => {
        dispatch({ type: actionTypes.TOGGLE_FAVORITE, payload: venueId });
    };

    const setSelectedSport = (sport) => {
        dispatch({ type: actionTypes.SET_SELECTED_SPORT, payload: sport });
    };

    const setSearchQuery = (query) => {
        dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: query });
    };

    const setFilters = (filters) => {
        dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
    };

    const resetFilters = () => {
        dispatch({ type: actionTypes.RESET_FILTERS });
    };


    const getFilteredVenues = () => {
        let filtered = state.venues;


        if (state.selectedSport) {
            filtered = filtered.filter(venue => venue.sport === state.selectedSport);
        }


        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(
                venue =>
                    venue.name.toLowerCase().includes(query) ||
                    venue.location.toLowerCase().includes(query) ||
                    venue.sport.toLowerCase().includes(query)
            );
        }


        filtered = filtered.filter(
            venue =>
                venue.price >= state.filters.minPrice &&
                venue.price <= state.filters.maxPrice
        );


        if (state.filters.rating > 0) {
            filtered = filtered.filter(venue => venue.rating >= state.filters.rating);
        }

        return filtered;
    };

    const isFavorite = (venueId) => {
        return state.favorites.includes(venueId);
    };

    const getActiveBookings = () => {
        return state.bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return booking.status !== 'CANCELLED' && bookingDate >= today;
        });
    };

    const getPastBookings = () => {
        return state.bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return booking.status !== 'CANCELLED' && bookingDate < today;
        });
    };

    const getCancelledBookings = () => {
        return state.bookings.filter(booking => booking.status === 'CANCELLED');
    };

    const value = {
        state,
        dispatch,
        addBooking,
        cancelBooking,
        toggleFavorite,
        setSelectedSport,
        setSearchQuery,
        setFilters,
        resetFilters,
        getFilteredVenues,
        isFavorite,
        getActiveBookings,
        getPastBookings,
        getCancelledBookings,
        loadVenues,
        loadBookings,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export default AppContext;
