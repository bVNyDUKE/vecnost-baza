export default function Footer() {
  return (
    <footer className="bg-primary-dark py-5 text-center text-white">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="flex-1">
            &copy; {new Date().getFullYear()} Vecnost
          </div>
        </div>
      </div>
    </footer>
  );
}
