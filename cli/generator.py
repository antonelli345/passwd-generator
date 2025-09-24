import string
import secrets
import typer
from rich.console import Console

console = Console()
app = typer.Typer(help="Secure and customizable password generator")


def generate_password(
    length: int = 12,
    uppercase: bool = True,
    lowercase: bool = True,
    digits: bool = True,
    symbols: bool = True,
    mode: str = "all"
) -> str:
    charset = ""

    # All mode
    if mode == "all":
        if uppercase:
            charset += string.ascii_uppercase
        if lowercase:
            charset += string.ascii_lowercase
        if digits:
            charset += string.digits
        if symbols:
            charset += string.punctuation

    # Easy to Read mode
    elif mode == "easy-to-read":
        easy_upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"  # excludes I, O
        easy_lower = "abcdefghijkmnopqrstuvwxyz"  # excludes l
        easy_digits = "23456789"                 # excludes 0,1
        easy_symbols = "!@#$%^&*()-_=+[]{}"     # easy-to-read symbols

        if uppercase:
            charset += easy_upper
        if lowercase:
            charset += easy_lower
        if digits:
            charset += easy_digits
        if symbols:
            charset += easy_symbols

    # Easy to Say mode
    elif mode == "easy-to-say":
        vowels = "aeiou"
        consonants = "bcdfghjklmnpqrstvwxyz"
        if lowercase:
            charset += consonants + vowels
        if uppercase:
            charset += consonants.upper() + vowels.upper()

    if not charset:
        raise ValueError("No character set was selected!")

    return "".join(secrets.choice(charset) for _ in range(length))


@app.command()
def cli(
    length: int = typer.Option(
        12, "--length", "-l", help="Password length"
    ),
    uppercase: bool = typer.Option(
        True, "--uppercase/--no-uppercase", help="Include uppercase letters"
    ),
    lowercase: bool = typer.Option(
        True, "--lowercase/--no-lowercase", help="Include lowercase letters"
    ),
    digits: bool = typer.Option(
        True, "--digits/--no-digits", help="Include digits"
    ),
    symbols: bool = typer.Option(
        True, "--symbols/--no-symbols", help="Include symbols"
    ),
    mode: str = typer.Option(
        "all", "--mode", "-m", help="Mode: all, easy-to-read, easy-to-say"
    )
):
    """
    Generates a secure password with customizable options.
    """
    try:
        password = generate_password(
            length,
            uppercase,
            lowercase,
            digits,
            symbols,
            mode
        )
        console.print("[bold green]Generated password:[/bold green]", password)
    except ValueError as e:
        console.print(f"[bold red]Error:[/bold red] {e}")


if __name__ == "__main__":
    app()
