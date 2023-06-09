import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { category } from 'utils/category';

import { useAuth } from 'contexts/Auth';
import { useToast } from 'contexts/Toast';

import { supabase } from 'services/supabase';

export function useRegister() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { storageUser } = useAuth();

  const [isRecurring, setIsRecurring] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [categories, setCategories] = useState(category);

  const schema = Yup.object({
    title: Yup.string().required('Campo obrigatório'),
    category: Yup.object().shape({
      name: Yup.string().required('Campo obrigatório'),
    }),
    date: Yup.string().required('Selecione uma data válida'),
    type: Yup.string()
      .required('Campo obrigatório')
      .oneOf(['income', 'outcome']),
  });

  function handleSwitch() {
    setIsRecurring(!isRecurring);

    if (!isRecurring) {
      setOpenBottomSheet(!openBottomSheet);
    }

    if (isRecurring) {
      formik.setFieldValue('recurrency', '');
    }
  }

  function verifyIfIsNumber(value: string) {
    const regex = /^[0-9]+$/;

    return regex.test(value);
  }

  function convertVirgulaToPonto(value: string) {
    const newValue = value.replace(',', '.');

    const number = Number(newValue);

    return number;
  }

  function parcelPurchaseValue(valor: number, parcelas: number) {
    const valorParcela = valor / parcelas;

    return valorParcela;
  }

  function payInParcel(value: number, parcel: number) {
    if (!parcel) {
      return;
    }

    const parcelas = parcel;
    const valor = value;

    const valorParcela = parcelPurchaseValue(Number(valor), Number(parcelas));

    const arrayParcelas = [];

    for (let i = 0; i < parcelas; i++) {
      const data = new Date(formik.values.date);
      data.setMonth(data.getMonth() + i);

      const novaData = data.toISOString().split('T')[0];

      arrayParcelas.push({
        title: `${formik.values.title} ${i + 1}/${parcelas}`,
        value: valorParcela,
        category: formik.values.category.name,
        date: novaData,
        type: formik.values.type,
        user_id: storageUser?.id,
      });
    }

    return arrayParcelas;
  }

  function isCategoryCreditCard(category: string) {
    const categoryExists = categories.find((item) => item.name === category);

    const isCreditCard = category.startsWith('Cartão');

    if (categoryExists && !isCreditCard) {
      return true;
    }

    return false;
  }

  function verifyOpenBottomSheet(category: string) {
    const categoryExists = categories.find((item) => item.name === category);

    const isCreditCard = category.startsWith('Cartão');

    if (categoryExists && isCreditCard) {
      setIsRecurring(true);
    }
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      value: '',
      category: {
        name: '',
        icon: '',
      },
      date: '',
      type: '',
      user_id: '',
      recurrency: '',
      parcel: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!values.value) {
        toast.error('Adicione um valor!', { id: 'error' });
        return;
      }

      if (Number(values.parcel) >= 24) {
        toast.error('Parcelamento máximo de 24x!', { id: 'error' });
        return;
      }

      try {
        if (!id) {
          if (values.parcel) {
            const arrayParcelas = payInParcel(
              Number(values.value),
              Number(values.parcel),
            );

            const { error: errorParcelas } = await supabase
              .from('finances_db')
              .insert(arrayParcelas);

            if (errorParcelas) {
              toast.error('Erro ao cadastrar!', { id: 'error' });
              return;
            }

            toast.success('Cadastrado com sucesso!', { id: 'success' });

            if (values.category.name.startsWith('Cartão')) {
              navigate('/cards');
              return;
            }

            navigate('/');
          }

          const { error } = await supabase.from('finances_db').insert([
            {
              title: values.title,
              value: verifyIfIsNumber(values.value)
                ? values.value
                : convertVirgulaToPonto(values.value),
              category: values.category.name,
              date: values.date,
              type: values.type,
              user_id: storageUser?.id,
            },
          ]);

          if (values.recurrency) {
            const { error: errorRecurrency } = await supabase
              .from('finances_recurrency')
              .insert([
                {
                  title: values.title,
                  recurrency: values.recurrency,
                  user_id: storageUser?.id,
                  value: verifyIfIsNumber(values.value)
                    ? values.value
                    : convertVirgulaToPonto(values.value),
                  category: values.category.name,
                  date: values.date,
                  type: values.type,
                },
              ]);

            if (errorRecurrency) {
              toast.error('Erro ao cadastrar!', { id: 'error' });
              return;
            }
          }

          if (error) {
            toast.error('Erro ao cadastrar!', { id: 'error' });
            return;
          }

          toast.success('Cadastrado com sucesso!', { id: 'success' });

          if (values.category.name.startsWith('Cartão')) {
            navigate('/cards');
            return;
          }

          navigate('/');
        }

        if (id) {
          const { error } = await supabase
            .from('finances_db')
            .update({
              id,
              title: values.title,
              value: verifyIfIsNumber(values.value)
                ? values.value
                : convertVirgulaToPonto(values.value),
              category: values.category.name,
              date: values.date,
              type: values.type,
              user_id: storageUser?.id,
            })
            .eq('id', id)
            .eq('user_id', storageUser?.id);

          if (values.recurrency) {
            const { error: errorRecurrency } = await supabase
              .from('finances_recurrency')
              .update([
                {
                  id,
                  recurrency: values.recurrency,
                  title: values.title,
                  user_id: storageUser?.id,
                  value: verifyIfIsNumber(values.value)
                    ? values.value
                    : convertVirgulaToPonto(values.value),
                  category: values.category.name,
                  date: values.date,
                  type: values.type,
                },
              ])
              .eq('id', id)
              .eq('user_id', storageUser?.id);

            if (errorRecurrency) {
              toast.error('Erro ao atualizar!', { id: 'error' });
              return;
            }
          }

          if (error) {
            toast.error('Erro ao atualizar!', { id: 'error' });
            return;
          }

          toast.success('Atualizado com sucesso!', { id: 'success' });

          navigate('/');
        }
      } catch (error) {
        toast.error('Erro ao cadastrar!', { id: 'error' });
      }
    },
  });

  async function getCreditCards() {
    const { data } = await supabase
      .from('credit_card_db')
      .select('*')
      .eq('user_id', storageUser?.id);

    if (!data) return;

    const newCategories = data.map((item) => ({
      name: `Cartão ${item.card_name}`,
      icon: 'CreditCard',
    }));

    const allCategories = [...categories, ...newCategories];

    const orderCategories = allCategories.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;

      return 0;
    });

    const uniqueCategories = orderCategories.filter(
      (item, index) =>
        orderCategories.findIndex((item2) => item.name === item2.name) ===
        index,
    );

    setCategories(uniqueCategories);
  }

  async function updateFinance() {
    if (!id) return;

    const { data, error } = await supabase
      .from('finances_db')
      .select('*')
      .eq('id', id)
      .eq('user_id', storageUser?.id);

    if (!data) return;

    const { data: recurrencyData } = await supabase
      .from('finances_recurrency')
      .select('*')
      .eq('title', data[0].title)
      .eq('user_id', storageUser?.id);

    if (!recurrencyData) return;

    if (error) {
      toast.error('Erro ao buscar dados!', { id: 'error' });
      return;
    }

    if (data && recurrencyData) {
      const newCategory = {
        name: data[0].category,
        icon: '',
      };

      formik.setFieldValue('title', data[0].title);
      formik.setFieldValue('category', newCategory);
      formik.setFieldValue('date', data[0].date);
      formik.setFieldValue('type', data[0].type);
      formik.setFieldValue('value', data[0].value);

      if (recurrencyData[0].recurrency) {
        setIsRecurring(true);
      }

      formik.setFieldValue('recurrency', recurrencyData[0].recurrency);
    }
  }

  useEffect(() => {
    if (id) {
      updateFinance();
    }
  }, [id]);

  useEffect(() => {
    getCreditCards();
  }, []);

  return {
    formik,
    isRecurring,
    setIsRecurring,
    handleSwitch,
    openBottomSheet,
    setOpenBottomSheet,
    categories,
    isCategoryCreditCard,
    verifyOpenBottomSheet,
  };
}
