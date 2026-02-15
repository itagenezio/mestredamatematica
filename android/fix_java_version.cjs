const fs = require('fs');
const path = require('path');

// Caminho para o arquivo build.gradle do Capacitor
const capacitorBuildGradlePath = path.join(__dirname, '..', 'node_modules', '@capacitor', 'android', 'capacitor', 'build.gradle');

console.log(`Verificando arquivo: ${capacitorBuildGradlePath}`);

if (fs.existsSync(capacitorBuildGradlePath)) {
    let content = fs.readFileSync(capacitorBuildGradlePath, 'utf8');
    
    // Substituir JavaVersion.VERSION_21 por JavaVersion.VERSION_17
    const updatedContent = content.replace(/JavaVersion\.VERSION_21/g, 'JavaVersion.VERSION_17');
    
    if (content !== updatedContent) {
        fs.writeFileSync(capacitorBuildGradlePath, updatedContent, 'utf8');
        console.log('✅ Versão do Java atualizada com sucesso para 17 no arquivo Capacitor build.gradle');
    } else {
        console.log('⚠️ Nenhuma alteração necessária no arquivo.');
    }
} else {
    console.error('❌ Arquivo build.gradle do Capacitor não encontrado!');
} 