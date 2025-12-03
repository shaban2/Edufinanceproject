import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { selectToken } from '../features/auth/authSlice';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = selectToken(getState());
      console.log('token_ui', token);
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['Goals', 'Expenses'],
  endpoints: (build) => ({
    // auth
    login: build.mutation({ query: (body) => ({ url: '/auth/login', method: 'POST', body }) }),
    register: build.mutation({ query: (body) => ({ url: '/auth/register', method: 'POST', body }) }),
    me: build.query({ query: () => '/auth/me' }),

    // public
    // getRandomTip: build.query({ query: (count = 1) => `/tips/random?count=${count}` }),
    getAllTips: build.query({ query: () => '/tips' }),
    getQuiz: build.query({ query: () => '/quiz' }),

    // goals (protected)
    getGoals: build.query({
      query: () => '/goals',
      providesTags: (result) =>
        result
          ? [...result.map((g) => ({ type: 'Goals', id: g._id })), { type: 'Goals', id: 'LIST' }]
          : [{ type: 'Goals', id: 'LIST' }]
    }),
    addGoal: build.mutation({
      query: (body) => ({ url: '/goals', method: 'POST', body }),
      invalidatesTags: [{ type: 'Goals', id: 'LIST' }]
    }),
    updateGoal: build.mutation({
      query: ({ id, ...patch }) => ({ url: `/goals/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (r, e, arg) => [{ type: 'Goals', id: arg.id }]
    }),
    deleteGoal: build.mutation({
      query: (id) => ({ url: `/goals/${id}`, method: 'DELETE' }),
      invalidatesTags: (r, e, id) => [{ type: 'Goals', id }, { type: 'Goals', id: 'LIST' }]
    }),
    markPurchased: build.mutation({
      query: ({ id, purchasePrice, purchasedAt }) => ({
        url: `/goals/${id}/purchase`,
        method: 'POST',
        body: { purchasePrice, purchasedAt }
      }),
      invalidatesTags: (r, e, arg) => [{ type: 'Goals', id: arg.id }]
    }),

    // expenses (protected)
    getExpenses: build.query({
      query: ({ from, to, page = 1, limit = 50 } = {}) => {
        const p = new URLSearchParams();
        if (from) p.set('from', from);
        if (to) p.set('to', to);
        if (page) p.set('page', String(page));
        if (limit) p.set('limit', String(limit));
        const qs = p.toString();
        return `/expenses${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [...result.map((e) => ({ type: 'Expenses', id: e._id })), { type: 'Expenses', id: 'LIST' }]
          : [{ type: 'Expenses', id: 'LIST' }]
    }),
    addExpense: build.mutation({
      query: (body) => ({ url: '/expenses', method: 'POST', body }),
      invalidatesTags: [{ type: 'Expenses', id: 'LIST' }, { type: 'Expenses', id: 'SUMMARY' }]
    }),
    updateExpense: build.mutation({
      query: ({ id, ...patch }) => ({ url: `/expenses/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (r, e, arg) => [{ type: 'Expenses', id: arg.id }, { type: 'Expenses', id: 'SUMMARY' }]
    }),
    deleteExpense: build.mutation({
      query: (id) => ({ url: `/expenses/${id}`, method: 'DELETE' }),
      invalidatesTags: (r, e, id) => [
        { type: 'Expenses', id },
        { type: 'Expenses', id: 'LIST' },
        { type: 'Expenses', id: 'SUMMARY' }
      ]
    }),
    getExpenseSummary: build.query({
      query: ({ from, to } = {}) => {
        const p = new URLSearchParams();
        if (from) p.set('from', from);
        if (to) p.set('to', to);
        const qs = p.toString();
        return `/expenses/summary${qs ? `?${qs}` : ''}`;
      },
      providesTags: [{ type: 'Expenses', id: 'SUMMARY' }]
    }),
    getResources: build.query({
      query: ({ q = '', category, tag, language, limit = 50 } = {}) => {
        const p = new URLSearchParams();
        if (q) p.set('q', q);
        if (category) p.set('category', category);
        if (tag) p.set('tag', tag);
        if (language) p.set('language', language);
        p.set('limit', String(limit));
        const qs = p.toString();
        return `/resources${qs ? `?${qs}` : ''}`;
      }
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  // useGetRandomTipQuery,
  useGetAllTipsQuery,
  useGetQuizQuery,
  useGetGoalsQuery,
  useAddGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useMarkPurchasedMutation,
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpenseSummaryQuery,
  useGetResourcesQuery
} = api;
