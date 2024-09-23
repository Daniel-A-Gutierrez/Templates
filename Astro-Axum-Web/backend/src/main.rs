use my_library::greet;
use std::io::{stdin, BufRead};
fn main() -> Result<(), std::io::Error>
{
    let mut name = String::new();
    println!("Hello, whats your name?");
    stdin().lock().read_line(&mut name)?;
    println!("{}", greet(&name));
    return Ok(());
}
