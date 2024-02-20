import { Oval } from 'react-loader-spinner';

export const Loader = () => {
  return (
    <Oval
      visible={true}
      height="40"
      width="40"
      color="#4fa94d"
      ariaLabel="oval-loading"
    />
  );
};
