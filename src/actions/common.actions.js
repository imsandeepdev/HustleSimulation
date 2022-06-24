import { loader_start, loader_end } from '../constants/common';

export const toggleLoader = ({
  action,
  loader,
  hideLoader = false,
}) => {
  if (action === 'start') return { type: loader_start, payload: { loader, hideLoader } };
  return { type: loader_end, payload: loader };
};
