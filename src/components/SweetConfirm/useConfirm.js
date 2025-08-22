// src/hooks/useConfirm.js
import Swal from 'sweetalert2';

/**
 * A reusable hook for showing a confirmation dialog with SweetAlert2.
 * @returns {function} An async function `confirm` that shows a dialog.
 */
const useConfirm = () => {
  /**
   * Shows a confirmation dialog.
   * @param {object} options - Options to override the defaults for SweetAlert2.
   * @param {string} options.title - The title of the dialog (required).
   * @param {string} options.text - The message/text of the dialog (required).
   * @param {string} [options.icon='warning'] - The icon to display ('warning', 'error', 'success', 'info', 'question').
   * @param {string} [options.confirmButtonText='Yes, proceed!'] - The text for the confirm button.
   * @returns {Promise<boolean>} A promise that resolves to `true` if confirmed, `false` otherwise.
   */
  const confirm = async (options) => {
    // These are our base styles and button configurations
    const defaultOptions = {
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!', // A more generic default
    };

    // We merge the defaults with the options you provide.
    // Any option you pass will override the default one.
    const finalOptions = { ...defaultOptions, ...options };

    // A check to ensure you always provide a title and text
    if (!finalOptions.title || !finalOptions.text) {
      console.error("Confirmation Error: 'title' and 'text' are required options.");
      return false; // Prevent the dialog from showing if not configured properly
    }

    const result = await Swal.fire(finalOptions);

    return result.isConfirmed;
  };

  return confirm;
};

export default useConfirm;