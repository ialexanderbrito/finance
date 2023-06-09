import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { Menu as MenuComponent, Transition } from '@headlessui/react';
import {
  CreditCard,
  DotsThreeVertical,
  FileCsv,
  FileXls,
  Moon,
  Power,
  Sun,
  User,
} from '@phosphor-icons/react';

import { useAuth } from 'contexts/Auth';
import { useTheme } from 'contexts/Theme';

export function Menu() {
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="z-50 flex items-center justify-center  text-right">
      <MenuComponent as="div" className="relative inline-block text-center">
        <div>
          <MenuComponent.Button className="flex w-full items-center justify-center">
            <DotsThreeVertical
              size={30}
              weight="light"
              className="text-secondary"
            />
          </MenuComponent.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuComponent.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-backgroundCard shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-backgroundCardDark dark:text-textDark">
            <div className="px-1 py-1 ">
              <MenuComponent.Item>
                <button
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  onClick={() => {
                    navigate('/profile');
                  }}
                >
                  <User
                    size={20}
                    weight="light"
                    className="mr-2 h-5 w-5 text-secondary"
                  />
                  Minha conta
                </button>
              </MenuComponent.Item>
              <MenuComponent.Item>
                <button
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  onClick={() => {
                    navigate('/credit-card');
                  }}
                >
                  <CreditCard
                    size={20}
                    weight="light"
                    className="mr-2 h-5 w-5 text-secondary"
                  />
                  Adicionar cartão
                </button>
              </MenuComponent.Item>
              <MenuComponent.Item>
                <button
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  onClick={() => {
                    navigate('/import');
                  }}
                >
                  <FileCsv
                    size={20}
                    weight="light"
                    className="mr-2 h-5 w-5 text-secondary"
                  />
                  Importar CSV
                </button>
              </MenuComponent.Item>
              <MenuComponent.Item>
                <button
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  onClick={() => {
                    navigate('/export');
                  }}
                >
                  <FileXls
                    size={20}
                    weight="light"
                    className="mr-2 h-5 w-5 text-secondary"
                  />
                  Exportar Planilha
                </button>
              </MenuComponent.Item>
              <MenuComponent.Item>
                <button
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  onClick={toggleTheme}
                >
                  <>
                    {theme === 'light' ? (
                      <Moon
                        size={20}
                        weight="light"
                        className="mr-2 h-5 w-5 text-secondary"
                      />
                    ) : (
                      <Sun
                        size={20}
                        weight="light"
                        className="mr-2 h-5 w-5 text-secondary"
                      />
                    )}
                  </>
                  Tema - {theme === 'light' ? 'Escuro' : 'Claro'}
                </button>
              </MenuComponent.Item>
              <MenuComponent.Item>
                <button
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  onClick={() => {
                    logOut();
                  }}
                >
                  <Power
                    size={32}
                    weight="light"
                    className="mr-2 h-5 w-5 text-secondary"
                  />
                  Sair
                </button>
              </MenuComponent.Item>
            </div>
          </MenuComponent.Items>
        </Transition>
      </MenuComponent>
    </div>
  );
}
