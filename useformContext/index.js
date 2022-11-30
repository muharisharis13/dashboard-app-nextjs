import { useForm, FormProvider } from "react-hook-form";
import React from "react";
import intialState from "./intialState";

const ReactHookFormProvider = ({ children }) => {
  const methods = useForm({
    defaultValues: intialState,
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default ReactHookFormProvider;
