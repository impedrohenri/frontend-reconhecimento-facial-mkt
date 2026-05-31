import Image from 'next/image'
import logoIcon from '../../public/assets/logo_icon.svg'
import logoText from '../../public/assets/logo_text.svg';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="flex items-center justify-between py-4 px-12  bg-white text-blue">
        <Link href="/" className="flex items-center space-x-2">
            <Image src={logoIcon} alt="Logo Icon" width={40} height={40} />
            <Image src={logoText} alt="Logo Text" width={120} height={20} />
        </Link>

        <nav id="nav" className="flex space-x-6">
            <Link href="/" className="text-gray hover:text-light-blue transition-colors duration-300">Home</Link>
            <Link href="/historico" className="text-gray hover:text-light-blue transition-colors duration-300">Histórico</Link>
            <Link href="/cadastrar-aluno" className="text-gray hover:text-light-blue transition-colors duration-300">Cadastrar Aluno</Link>
        </nav>
    </div>
  )
}
