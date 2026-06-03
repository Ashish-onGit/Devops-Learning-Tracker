import { createSlice } from '@reduxjs/toolkit';

const loadCertifications = () => {
  const defaults = { examDates: {}, checkedDomains: {} };
  try {
    const serialized = localStorage.getItem('devops_certs');
    if (serialized) {
      const parsed = JSON.parse(serialized);
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch (e) {
    return defaults;
  }
};

const saveCertifications = (state) => {
  try {
    localStorage.setItem('devops_certs', JSON.stringify(state));
  } catch (e) {}
};

const certificationsSlice = createSlice({
  name: 'certifications',
  initialState: loadCertifications(),
  reducers: {
    toggleDomainCheck: (state, action) => {
      const { certCode, domainName } = action.payload;
      if (!state.checkedDomains[certCode]) {
        state.checkedDomains[certCode] = [];
      }
      const domains = state.checkedDomains[certCode];
      const index = domains.indexOf(domainName);
      if (index >= 0) {
        domains.splice(index, 1);
      } else {
        domains.push(domainName);
      }
      saveCertifications(state);
    },
    setExamDate: (state, action) => {
      const { certCode, date } = action.payload;
      state.examDates[certCode] = date;
      saveCertifications(state);
    }
  }
});

export const { toggleDomainCheck, setExamDate } = certificationsSlice.actions;
export default certificationsSlice.reducer;
