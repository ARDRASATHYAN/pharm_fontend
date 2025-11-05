
import CustomizedDialogs from "../../../components/commen/Dialog";

import MedicineForm from "../MedicineForm";




export default function MedicinForm({ open, handleClose, onSubmit }) {


    return (
        <CustomizedDialogs open={open} handleClose={handleClose}>
           <MedicineForm/>
        </CustomizedDialogs>
    );
}
