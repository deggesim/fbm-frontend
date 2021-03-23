import { User } from "@app/shared/models/user";
import { createReducer } from "@ngrx/store";

const initialState: User = null;

export const userReducer = createReducer(initialState);