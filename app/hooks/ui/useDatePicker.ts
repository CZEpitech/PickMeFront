import { useState } from "react";
import { Alert } from "react-native";

interface UseDatePickerReturn {
  showDatePicker: boolean;
  tempDate: Date;
  openDatePicker: (currentDate?: string) => void;
  onDateChange: (event: any, selectedDate?: Date) => void;
  confirmDateSelection: (onConfirm: (dateString: string) => void) => void;
  cancelDateSelection: () => void;
  formatDateForDisplay: (dateString: string) => string;
  getSelectedDate: (currentDate?: string) => Date;
}

export const useDatePicker = (): UseDatePickerReturn => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const getSelectedDate = (currentDate?: string): Date => {
    if (currentDate) {
      return new Date(currentDate);
    }
    // Date par défaut : 25 ans
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 25);
    return defaultDate;
  };

  const openDatePicker = (currentDate?: string) => {
    const dateToUse = currentDate ? new Date(currentDate) : getSelectedDate();
    setTempDate(dateToUse);
    setShowDatePicker(true);
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const confirmDateSelection = (onConfirm: (dateString: string) => void) => {
    // Validation de l'âge
    const today = new Date();
    const age = today.getFullYear() - tempDate.getFullYear();
    const monthDiff = today.getMonth() - tempDate.getMonth();
    const dayDiff = today.getDate() - tempDate.getDate();

    // Calcul précis de l'âge
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (actualAge < 18) {
      Alert.alert(
        "Âge invalide",
        "Vous devez avoir au moins 18 ans pour utiliser cette application."
      );
      return;
    }

    if (actualAge > 120) {
      Alert.alert(
        "Date invalide",
        "Veuillez entrer une date de naissance valide."
      );
      return;
    }

    const dateString = tempDate.toISOString().split("T")[0];
    onConfirm(dateString);
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "Sélectionner une date";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return {
    showDatePicker,
    tempDate,
    openDatePicker,
    onDateChange,
    confirmDateSelection,
    cancelDateSelection,
    formatDateForDisplay,
    getSelectedDate,
  };
};
