import { useReducer, ChangeEvent } from "react";

type FormState<T> = T;

type FormAction<T> = { field: keyof T; value: string };

const formReducer = <T extends Record<string, string>>(
  state: FormState<T>,
  action: FormAction<T>
): FormState<T> => {
  return {
    ...state,
    [action.field]: action.value,
  };
};

export function useFormReducer<T extends Record<string, string>>(
  initialState: FormState<T>
) {
  const [formState, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ field: e.target.name as keyof T, value: e.target.value });
  };

  return { formState, handleChange };
}
