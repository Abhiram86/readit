import { Input } from "./Form";
import ModalContainer from "./ModalContainer";

export default function EditForm() {
  return (
    <ModalContainer className="top-0 p-2">
      <div>
        <h1>Edit Your Personal Information</h1>
        <form>
          <Input placeholder="Name" className="" />
        </form>
      </div>
    </ModalContainer>
  );
}
