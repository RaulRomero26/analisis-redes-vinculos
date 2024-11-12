import { ModalNombre, ModalTelefono} from './';

interface ModalSwitchProps {
  entidad: string;
  isModalOpen: boolean;
  toggleModal: (entidad?: string) => void;
  setData: React.Dispatch<React.SetStateAction<any>>;
  getData: () => any;
}

export const ModalSwitch = ({ entidad, isModalOpen, toggleModal, setData, getData }: ModalSwitchProps) => {
  switch (entidad) {
    case 'persona':
      return <ModalNombre isModalOpen={isModalOpen} toggleModal={toggleModal} setData={setData} getData={getData}/>;
    case 'telefono':
     return <ModalTelefono isModalOpen={isModalOpen} toggleModal={toggleModal} setData={setData} getData={getData}/>;
    default:
      return null;
  }
};

export default ModalSwitch;